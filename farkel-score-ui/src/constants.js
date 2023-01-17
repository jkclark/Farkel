export const DEFAULT_WIN_NUMBER = 10_000;

export const GOT_IN = -2;

export const NOT_GOT_IN = -1;

export const MAX_PLAYERS = 8;

export const INITIAL_COLORS = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

export const FAQ_CONTENTS = {
  title: "FAQ",
  body: (
    <div>
      <h6>What is Farkle?</h6>
      <p>
        Farkle (also spelled Farkel) is a dice game with many variations and
        scoring rules. You can read all about Farkle on{" "}
        <a
          href="https://en.wikipedia.org/wiki/Farkle"
          target="_blank"
          rel="noreferrer"
        >
          Wikipedia
        </a>
        .
      </p>
      <h6>Can I play Farkle here?</h6>
      <p>
        No, this website is only for keeping score. There are other websites
        where you can play online for free, like{" "}
        <a href="https://cardgames.io/farkle/" target="_blank" rel="noreferrer">
          this one
        </a>
        .
      </p>
      <h6>What do I need to play?</h6>
      <p>If you're using this website to keep score, all you need is 6 dice!</p>
      <h6>What are the rules?</h6>
      <p>
        There are many variations on the rules to Farkle, but the flow of play
        is largely the same between them. Refer to{" "}
        <a
          href="https://en.wikipedia.org/wiki/Farkle"
          target="_blank"
          rel="noreferrer"
        >
          Wikipedia
        </a>{" "}
        for a full explanation of the rules. There are variations to play and
        scoring, and this website imposes some specific rules:
        <ul>
          <li>
            Players must "get in" before they can start accumulating points.
            This means all players will score 0 points on at least their first
            turn.
          </li>
          <li>Turn scores are always nonnegative.</li>
        </ul>
      </p>
    </div>
  ),
};

export const ABOUT_CONTENTS = {
  title: "About",
  body: (
    <div>
      <p>My name is Josh, and I'm a software developer from New York.</p>
      <p>
        My family and I have played Farkle together for most of my life. After
        years of scoring Farkle games on paper, which involves mental math and
        scratching out incorrect scores, I decided to try to automate it. This
        automated Farkle scorer started out as a rudimentary command-line
        script. Years later, I drew the scoreboard in the terminal with ASCII
        art. Recently I learned how to use React, so I decided to upgrade my
        Farkle script to a proper website and publish it for the world to use.
      </p>
      <p>
        If you have any comments, questions, or just want to say hi, you can
        write to me at{" "}
        <a href="mailto:jclarktennis@gmail.com">jclarktennis@gmail.com</a>.
      </p>
    </div>
  ),
};
