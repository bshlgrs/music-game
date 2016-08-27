var MusicGame = React.createClass({
  getInitialState: function() {
    return {
      value: 'c4',
      currentNote: null,
      notesGuessed: 0,
      guesses: 0,
      previousNote: null,
      blackKeysOn: true
    };
  },
  getNote: function () {
    var highestNum = noteNameToNumber(this.props.highestNote);
    var lowestNum = noteNameToNumber(this.props.lowestNote);

    var noteNum = this.state.previousNote;

    var isBlackKey = function (n) {
      return noteNumberToName(n).indexOf("#") != -1;
    }

    while (noteNum == this.state.previousNote || (!this.state.blackKeysOn && isBlackKey(noteNum))) {
      noteNum = Math.random() * (highestNum - lowestNum + 1) | 0 + lowestNum;
    }

    this.setState({ currentNote: noteNum });
    window.play(noteNum, 0, 1);
  },
  tryNote: function (event) {
    // var noteNum = Math.random() * 12 | 0 + 48;
    var noteNum = noteNameToNumber(event.target.text);

    if (noteNum == this.state.currentNote) {
      this.setState({previousNote: this.state.currentNote});
      this.setState({currentNote: null});
      this.setState({ notesGuessed: this.state.notesGuessed + 1 });
      this.setState({ guesses: this.state.guesses + 1 });
    } else {
      this.setState({ guesses: this.state.guesses + 1 });
    }

    window.play(noteNum, 0, 1);
  },
  toggleBlackNotes: function () {
    this.setState({ blackKeysOn: !this.state.blackKeysOn });
  },
  getKeys: function (currentNote) {
    var out = [];
    var black_key = {"backgroundImage": "linear-gradient(#000000, #222222, #555555)"};
    var white_key = {"backgroundImage": "linear-gradient(#AAAAAA, #EEEEEE, #FFFFFF)"};

    for (var i = noteNameToNumber(this.props.lowestNote); i <= noteNameToNumber(this.props.highestNote); i++) {
      var color = noteNumberToName(i).indexOf("#") == -1 ? white_key : black_key;

      if (color == white_key || this.state.blackKeysOn) {
        out.push(
          <a
            className="btn btn-sml btn-default"
            style={color}
            disabled={currentNote ? "" : "disabled"}
            key={i}
            onClick={currentNote && this.tryNote}>
            {noteNumberToName(i)}
          </a>);
      }

      if (i % 12 == 11) {
        out.push(<br key={i+0.5}/>)
      }
    }
    return out;
  },
  replayNote: function () {
    window.play(this.state.currentNote, 0, 1);
  },
  render: function () {
    var value = this.state.value;
    var log = this.state.log;
    return (
      <div>
        <h3>Music game!</h3>
        <div className="panel panel-default">
          <div className="panel-body">
            <p>Wow, a cool relative pitch training game!</p>
            <p>Press "give me a note" to get a note! Then, press buttons until you find the right note!</p>
          </div>
        </div>

        <button className="btn btn-default" onClick={this.toggleBlackNotes}>
          {this.state.blackKeysOn ? "dis" : "en"}able black keys
        </button>

        <p>Notes guessed: {this.state.notesGuessed}</p>
        <p>Guesses: {this.state.guesses}</p>
        {this.state.notesGuessed > 0 && <p>Average number of guesses required:
         {this.state.guesses / this.state.notesGuessed}</p>}



        {this.state.currentNote ? <button disabled="disabled"
          className="btn btn-primary">give me a note!</button>
         : <button
          onClick={this.getNote}
          className="btn btn-primary">give me a note!</button>}
        {this.state.currentNote &&
          <button className="btn btn-default" onClick={this.replayNote}>replay</button>}
        <p>{this.getKeys(this.state.currentNote)}</p>

        <p>This game was built with React and <a href="https://github.com/mudcube/MIDI.js/">MIDI.js</a>.</p>
        <p>You can view the source <a href="https://github.com/bshlgrs/music-game">on Github.</a></p>
        <p>I also made a <a href="https://github.com/bshlgrs/music-game-react-native">mobile app version</a>.</p>
      </div>
    );
  }
});


var noteNames = "c c# d d# e f f# g g# a a# b".split(" ");

var noteNameToNumber = function(name) {
  var noteName = name.slice(0, -1).toLowerCase();
  var noteNumber = parseInt(name[name.length - 1]);

  return noteNames.indexOf(noteName) + noteNumber * 12;
}

var noteNumberToName = function (number) {
  return noteNames[number % 12] + (number / 12 | 0);
}

$(function () {
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    onprogress: function(state, progress) {
      console.log(state, progress);
    },
    onsuccess: function() {


      var delay = 0; // play one note every quarter second
      var note = 50; // the MIDI note
      var velocity = 127; // how hard the note hits
      // play the note
      MIDI.setVolume(0, 127);

      $("#stfu").on("click", function (e) {
        noteNum = Math.random() * 37 | 0 + 36;
        play(noteNum, 0, 1);
      });

      ReactDOM.render(<MusicGame lowestNote="c3" highestNote="c6"/>, document.getElementById("music-game"));
    }
  });
});




