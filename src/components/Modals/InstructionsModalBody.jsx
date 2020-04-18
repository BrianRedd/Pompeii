/** @module InstructionsModalBody */

import React, { useState } from "react";
import { Tooltip } from "reactstrap";

/**
 * @function InstructionsModal
 * @description Functional Container component for Instructions Modal
 * @returns {React.Component} - Rendered component.
 */
const InstructionsModalBody = () => {
  const [tooltipOpen, setTooltipOpen] = useState("");

  const toggle = tip => {
    let value = tip;
    if (tooltipOpen.includes(tip)) {
      value = "";
    }
    setTooltipOpen(value);
  };

  return (
    <React.Fragment>
      <Tooltip
        isOpen={tooltipOpen === "card"}
        target="card"
        toggle={() => toggle("card")}
      >
        <img
          className="pompeii-card"
          src="./assets/cards/Pomp-3-P.png"
          alt="Pompeii Card"
        />
      </Tooltip>
      <Tooltip
        isOpen={tooltipOpen === "ad79"}
        target="ad79"
        toggle={() => toggle("ad79")}
      >
        <img
          className="pompeii-card"
          src="./assets/cards/AD79-0-S.png"
          alt="AD 79 Card"
        />
      </Tooltip>
      <Tooltip
        isOpen={tooltipOpen === "lava"}
        target="lava"
        toggle={() => toggle("lava")}
      >
        <img
          className="tile-tooltip"
          src="./assets/tiles/Scroll.png"
          alt="Lava Tile"
        />
      </Tooltip>
      <Tooltip
        isOpen={tooltipOpen === "omen"}
        target="omen"
        toggle={() => toggle("omen")}
      >
        <img
          className="pompeii-card"
          src="./assets/cards/Omen-0-S.png"
          alt="Omen Card"
        />
      </Tooltip>
      <section id="overview">
        <h3>Game Overview</h3>
        <p>
          <i>The Downfall of Pompeii</i> (aka Pompeii) is played in two phases:
          In the first, you try to bring as many of your own people into the
          city as you can by playing <span id="card">Pompeii cards</span>. If
          you play a house number 3, for example, you may put one of your people
          into a build with that number. There are 2 &quot;
          <span id="ad79">AD 79</span>&quot; cards. As soon as the second AD 79
          card appears, Vesuvius erupts and the second phase of the game begins.
          Now, move as many of your people out of the city through the gates as
          you can before <span id="lava">lava tiles</span> cover Pompeii. You
          win if you are the player who has saved the most of your own people
          before the end of the game.
        </p>
      </section>
      <section id="play">
        <h3>How to Play</h3>

        <section id="phaseI-ptI">
          <h5>
            First Phase Part I: New Citizens Move to Pompeii (Vesuvius Sleeps)
          </h5>
          <p>
            On your turn, you take three (3) actions, in the following order:
          </p>
          <ol>
            <li>Play 1 of the 4 cards from your hand</li>
            <li>
              Put 1 of your people on an open space in a build whose number
              matches that on the card being played
            </li>
            <li>Draw a card from the deck</li>
          </ol>
          <p>
            The <span id="card">Pompeii cards</span> contain 3 important pieces
            of information:
          </p>
          <ul>
            <li>
              The <span className="font-weight-bold">Number</span> on the card
              corresponds to one of 11 buildings on the board. This is the build
              that you will place a person into when you play a card on your
              turn.
            </li>
            <li>
              The <span className="font-weight-bold">Color</span> of the card
              (grey, turquoise, brown, or purple) corresponds to the color of a
              set of buildings on the board (and will match the color of the
              specific building designated by the number).
            </li>
            <li>
              The <span className="font-weight-bold">Symbols</span> at the
              bottom of the card show both the number of the cards in the deck
              with that number, and the number and grouping of available spaces
              within the corresponding building. All of the buildings on the
              board show the number of available spaces for people to be put
              into. The specific group(s) of spaces within a building becomes
              important later in the game (see Phase One, Part II).
            </li>
          </ul>
          <p>
            In addition, there are neutral (beige) buildings on the board with
            no number. These become important in Phase One, Part II.
          </p>
          <p className="font-italic">
            NOTE: The house numbers 3, 4, 6, 7, 10, and 11 are building with at
            least two parts. When playing a card with one of these numbers, you
            can place your person in any part of the building.
          </p>
          <h5>First Phase Part II: Relatives and Omens (Vesuvius Seethes)</h5>
          <p>
            When the first <span id="ad79">AD 79</span> card is drawn, you
            immediately get another card as a replacement. Vesuvius seethes.
          </p>
          <p>From now on, there are two new rules:</p>
          <h6>New Rule: Omen Cards</h6>
          <p>
            When you draw an <span id="omen">Omen card</span> off the deck,
            discard it immediately. Then, take another player&apos;s person from
            anywhere on the board and sacrifice it. This piece is now a casualty
            and is out of the game. Then draw a replacement card. If you draw
            another Omen card, repeat the process. Your turn ends when you draw
            a non-Omen card as a replacement.
          </p>
          <h6>New Rule: Relatives</h6>
          <p>
            If you add a person to a building that already contains one or more
            occupants (regardless of color), you may optionally put additional
            pieces (&quot;relatives&quot;) in different squares as part of the
            same move. Relatives can be placed in buildings of the same color or
            neutral (beige) buildings. Since there are no Pompeii cards for the
            neutral buildings, they can only be filled by meanws of the
            &quot;relatives&quot; rule.
          </p>
          <p>
            For each game piece already in the part of the building you place
            your piece, you place another into:
          </p>
          <ul>
            <li>A different building of the same color</li>
            <li>
              Another part of the same building if the building has multiple
              parts/squares
            </li>
            <li>A neutral (beige non-numbered) building</li>
          </ul>
          <p>
            You cannot place relatives into the same part/square of the building
            as your original piece was placed in. You may place relatives into
            multiple different neutral buildings, but never multiple relatives
            into the same neutral building.
          </p>
          <p>
            When counting existing pieces to determine the number of relatives,
            ignore pieces in different parts of the same building. You can only
            place one relative into any given building in the same move.
          </p>
          <p>
            Putting relatives into buildings that already have game pieces in
            them does not trigger the &quot;relatives&quot; rule again; in other
            words, there are no &quot;chain reactions&quot;. It may happen that
            there are not enough free spaces for all relatives to be placed -
            that case, you cannot place the extra relatives.
          </p>
          <h6>Wild Cards</h6>
          <p>
            If all of the spaces within a building belonging to the number on a
            card are occupied, you may play the card as a wild card. You put one
            person on any free space in any building, regardless of color of
            building.
          </p>
          <p>
            However, pieces moved into a build by means of a wild card do not
            trigger the &quot;relatives&quot; rule!
          </p>
        </section>
        <section id="phaseI-ptI">
          <h5>Phase Part II: VESUVIUS ERUPTS!</h5>
          <p>
            The first phase of the game ends when the second{" "}
            <span id="ad79">AD 79 card</span> is drawn. No more cards will be
            played, nor will any new pieces be placed onto the board.
          </p>
          <h6>The Lava Begins to Flow!</h6>
          <p>
            Every lava tile shows one of six different symbols. For each symbol
            (scroll, vase, helmet, mask, coin, and column) there is a vent space
            on the board. The first tile of a symbol is put on its corresponding
            vent.
          </p>
          <p>
            All lava tiles must be placed either on their vent or orthogonally
            (up, down, left, or right, but not diagonally) adjacent to existing
            tiles of the same type.
          </p>
          <p>
            The player in turn after the player who drew the{" "}
            <span id="ad79">AD 79 card</span> (and thus triggered the eruption!)
            draws the first <span id="lava">lava tile</span> and places it on
            its vent. Then the next player draws a tile and places it either on
            its vent or orthogonally adjacent to an existing tile of the same
            type, and so on until there are{" "}
            <span className="font-weight-bold">six (6)</span> tiles thus placed
            upon the board.
          </p>
          <p>
            Any pieces on a square that is covered with a lava tile are
            immediately removed from the board as casualties of the eruption!
          </p>
          <h6>RUN FOR YOUR LIVES!</h6>
          <p>
            Once there are six (6) lava tiles on the board, the second phase
            begins. Each subsequent turn consists of two (2) steps:
          </p>
          <ol>
            <li>Draw one (1) lava tile and place it on the board</li>
            <li>Move two (2) of your game pieces</li>
          </ol>
          <h6>Draw a lava tile</h6>
          <p>
            The player whose turn it is starts by drawing a lava tile and
            placing it on the board. If it&apos;s the first tile of its type,
            the tile is placed upon its vent. Otherwise, it is placed
            orthogonally adjacent to an existing lava tile of the same type.
          </p>
          <p>
            Any pieces on a square that is covered with a lava tile (even your
            own!) are immediately removed from the board as casualties of the
            eruption!
          </p>
          <p>
            If there is no place to place a lava tile, no tile is placed. In
            other words, if you draw a Scroll lava tile but there are no
            available spots orthogonally adjacent to existing Scroll lava tiles,
            no tiles are placed and you move on to the next step of your turn.
          </p>
          <p>
            The goal is to escape as many of your people from Pompeii as
            possible by passing them through the gates of the city. All spaces
            that are blocked from all exits (surrounded by lava with no access
            to any city gate) are also immediately covered in lava, with any
            pieces therein removed (since there is no way for them to escape).
          </p>
          <h6>Move game pieces</h6>
          <p>
            On your turn, you may move up to two (2) of your game pieces.
            Typically, this would be moving two different pieces (exceptions are
            below). The total number of pieces (regardless of color) in a square
            determines the maximum movement for each piece in the square. You
            many move your piece one (1) city block (square) for each piece in
            the square that piece starts from. You are not required to move the
            maxiumum.
          </p>
          <p className="font-italic">
            NOTE: During this phase of the game, you ignore the actual
            buildings; you are only concerned with squares. Thus a building
            covering two squares still counts as two spaces, not one. Also,
            ignore the maximum number of pieces a building can contain; while
            the city evacuates, there is no limit to the number of pieces that
            may occupy the same space.
          </p>
          <p>
            You can move a piece vertically or horizontally, but not diagonally.
            Changing direction is allowed, even more than once in the same move,
            but moving back and forth is not. You may move a game piece onto any
            city square except those covered in lava or empty lava vents. You
            may leave &quot;move points&quot; unused if you do not want to move
            the maximum allowed.
          </p>
          <p>
            Pieces that are moved <span className="font-italic">through</span> a
            city gate are safe from the volcano. Just moving to the gate is not
            enough; it takes one &quot;move point&quot; to pass through the gate
            and into safety.
          </p>
          <p>
            You are allowed to move two pieces during this step. There are two
            exceptions that will allow you to move only one:
          </p>
          <ol>
            <li>
              If you only have one piece left on the board, you can move it
              twice. Each move will use the number of existing occupants in the
              square to determine &quot;move points&quot;. For example: if a
              player&apos;s only place starts in a square with three people,
              they can move that piece three spaces. If that piece stops in a
              square with one other person, then it can immediately move two
              spaces (since when they start running, there are two people in the
              square they start from).
            </li>
            <li>
              If a piece is alone in a square at the start of your turn, you may
              move that piece twice instead of moving two separate pieces. The
              first move will be only one square (since it started in a square
              with only the one occupant), but the second move will be
              determined by the number of pieces in the square they moved into.
            </li>
          </ol>
          <p>
            There is one additional exception: If you do not have any pieces
            remaining on the board, you cannot move any pieces. Instead, your
            turn ends after placing your lava tile.
          </p>
        </section>
        <section id="gameover">
          <h5>End of the Game</h5>
          <p>The game ends one of two ways:</p>
          <ul>
            <li>
              When you draw the last lava tile, the game ends. All remaining
              spaces on the board are immediately covered in lava, and all
              pieces remaining are removed as casualties.
            </li>
            <li>
              If there are no game pieces left on the board, the game also ends.
            </li>
          </ul>
          <p>
            The player who has saved the most pieces wins the game! If there is
            a tie, then the player who saved the most and who has the least
            number of casualties is the winner.
          </p>
        </section>
      </section>
      <section id="dualvent">
        <h5>Dual Vent Variant</h5>
        <p>
          If all players are human, you can select the Wild Lava Tiles variant.
          This adds three &quot;wild&quot; lava tiles that each can be played as
          either one lava tile type or another. For instance, there is a wild
          tile that can be played as either a Helmet or as a Mask.
        </p>
      </section>
      <section id="thisversion">
        <h5>Notes on the Computer Version</h5>
        <p>
          This game is based on the board game <i>The Downfall of Pompeii</i>,
          and utilizes the same rules as the board game.
        </p>
        <p>
          When starting the game, you can choose two (2) to four (4) players,
          and each player can either be a human or an AI. There are six AI
          players, and each uses a slightly different strategy based on
          different values (courage, sociability, and lawfulness).
        </p>
        <p>
          Game play proceeds as described above. For humans playing against AIs,
          you may need to click the card deck or lava tile pile in order to draw
          the AI&apos;s card or tile. Otherwise, the AI&apos;s should play their
          own pieces.
        </p>
        <p>
          When a human player has a choice of where to place a person, lava
          tile, or where to run a piece, the available choices will be
          highlighted, and you simply click on the one to make your choice.
        </p>
        <p>
          At the top right of the game board an icon will appear next to the
          statistics icon; clicking this will either bypass any further
          placement of relatives or any further running (depending on phase).
        </p>
        <p>
          Finally, there are some &quot;Dev Mode&quot; options which can be
          selected, which can enable/disable AI autoplay, set starting phase,
          allow pre-population of the board, disable the six turns of lava tile
          placement before pieces can run (&quot;surprise&quot;), and/or show
          the relative values the AI&apos;s place on their move choices.
        </p>
        <p>
          This web app is unlicensed and not intended for profit; I simply love
          this board game and wanted to embark on the adventure of coding it in
          React. If you like this game, I highly recommend purchasing the
          physical version.
        </p>
        <p>
          Any questions or comments, please email me (Brian Redd) at{" "}
          <a href="mailto:me@rbrianredd.com?subject=Downfall of Pompeii">
            me@rbrianredd.com
          </a>
        </p>
      </section>
      <section id="credits">
        <h5>Boardgame Credits</h5>
        <p>
          <span className="font-weight-bold">Designer:</span> Klaus-J&uuml;
          Wrede
        </p>
        <p>
          <span className="font-weight-bold">Dual Vent Variant:</span> Morgan
          Dontanville
        </p>
        <p>
          <span className="font-weight-bold">Development:</span> AMIGO Spiel +
          Freizeit, GmbH
        </p>
        <p>
          <span className="font-weight-bold">Artist:</span> Oliver Freudenreich
          (contents) &amp; Guido Hoffman (cover)
        </p>
        <p>
          <span className="font-weight-bold">Translation:</span> Alex Yeager
        </p>
        <p>
          <span className="font-weight-bold">
            Production (2nd English Edition):
          </span>{" "}
          Ron Magin &amp; Pete Fenlon
        </p>
        <p>
          <span className="font-weight-bold">Special Thanks:</span> Richard
          Bertok, Peter Bromley, Robert T. Carty, Jr., Coleman Charlton, Dan
          Decker, Marinda Darnell, Morgan Dontanville, Nick Johnson, Misty
          Kesler, Kim Marino, Marty McDonnell, Brad McWilliams, Jim Miles,
          Jacqui Rex, Chuck Rice, Bridget and Larry Roznai, Loren Roznai, Brad
          Steffen, Brian Steffen, Guido Teuber, Bill and Elaine Wordelmann, Alex
          and Julie Yeager
        </p>
        <p>
          <span className="font-weight-bold">Email:</span>{" "}
          <a href="mailto:custserv@mayfairgames.com">
            CustServ@mayfairgames.com
          </a>
        </p>
        <p className="font-weight-bold">
          <a href="http://www.mayfairgames.com" target="_new">
            WWW.MAYFAIRGAMES.COM
          </a>
        </p>
        <p>Copyright &copy; 2006, 2013 Mayfair Games, Inc.</p>
      </section>
    </React.Fragment>
  );
};

export default InstructionsModalBody;
