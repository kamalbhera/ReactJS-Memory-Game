import React from "react";
import { History, LocationState } from "history";
import { default as CardsJSONData } from "../data/cards.json";
import ErrorComponent from "../components/ErrorComponent";

interface IMemoryGameLayoutProps {
  history: History<LocationState>;
}

interface IMemoryGameLayoutState {
  cards: Array<any>;
  selectedCardKeyIndex: Array<number>;
  gameTimer: string;
  gameFinished: boolean;
}

class MemoryGameLayout extends React.Component<
  IMemoryGameLayoutProps,
  IMemoryGameLayoutState
> {
  private cardsChoices = [];
  private difficulty: string = "easy";
  private solvedCards: Array<string> = [];
  private timerStartDate: Date;
  private moveErrors = 0;
  public errorMessage: string = "";
  public timerInterval: any;
  public disabledClickOnCard: boolean = false;

  constructor(props: any) {
    super(props);

    const cardChoicesArray = [...this.cardsChoices].concat([
      ...this.cardsChoices,
    ]);
    this.state = {
      cards: cardChoicesArray,
      selectedCardKeyIndex: [],
      gameTimer: "0m 0s",
      gameFinished: false,
      // solvedCards: [],
    };
    this.timerStartDate = new Date();
  }

  componentDidMount(): void {
    if (
      this.props.history.location.search &&
      this.props.history.location.search !== ""
    ) {
      this.difficulty = this.props.history.location.search.replace(
        "?difficulty=",
        ""
      );
      const data = CardsJSONData;
      const slicedCardData =
        this.difficulty === "hard"
          ? data
          : this.difficulty === "medium"
          ? data.slice(0, 6)
          : data.slice(0, 4);
      this.setState({ cards: slicedCardData }, () => this.shuffleCards());
    }
    this.initialiseGameTimer();
  }

  private shuffleCards = (): void => {
    // shuffle
    const newcards = [...this.state.cards].concat([...this.state.cards]);
    const shuffledCards = newcards
      .map((card) => ({ sortValue: Math.random(), value: card }))
      .sort((a, b) => a.sortValue - b.sortValue)
      .map((sortedCard) => sortedCard.value);
    this.setState({ cards: shuffledCards });
  };

  private initialiseGameTimer = (): void => {
    // timer
    this.timerInterval = setInterval(() => {
      let newDate = new Date();
      let diffInMilliseconds =
        newDate.getTime() - this.timerStartDate.getTime(); // milliseconds
      let minutes = Math.floor(diffInMilliseconds / 60000); // 1ms = 1/1000s = 1/60000m
      var seconds = ((diffInMilliseconds % 60000) / 1000).toFixed(0);
      this.setState({ gameTimer: `${minutes}m ${seconds}s` });
    }, 1000);
  };

  private checkIfCardsMatch = (): void => {
    if (this.state.selectedCardKeyIndex.length === 2) {
      if (
        this.state.cards[this.state.selectedCardKeyIndex[0]].key ===
        this.state.cards[this.state.selectedCardKeyIndex[1]].key
      ) {
        this.solvedCards.push(
          this.state.cards[this.state.selectedCardKeyIndex[0]].key
        );
        this.setState({ selectedCardKeyIndex: [] });
        // this.setState((prevState) => ({
        //   solvedCards: [
        //     ...prevState.solvedCards,
        //     this.state.cards[this.state.selectedCardKeyIndex[0]].key,
        //   ],
        // }));
      } else {
        this.moveErrors += 1;
        this.disabledClickOnCard = true;
        setTimeout(() => {
          this.setState({ selectedCardKeyIndex: [] });
          this.disabledClickOnCard = false;
        }, 3000);
      }

      let finalCount =
        this.difficulty === "hard" ? 16 : this.difficulty === "medium" ? 12 : 8;
      if (this.solvedCards.length === finalCount / 2) {
        this.setState({ gameFinished: true });
        clearInterval(this.timerInterval);
      }
    }
  };

  handleCardClick = (cardKey: string, cardIndex: number): void => {
    this.setState(
      (prevState) => ({
        selectedCardKeyIndex: [...prevState.selectedCardKeyIndex, cardIndex],
      }),
      () => this.checkIfCardsMatch()
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.errorMessage === "" ? null : (
          <ErrorComponent errorMessage={this.errorMessage} />
        )}
        {this.state.gameFinished === true ? (
          <React.Fragment>
            <h2>
              You have completed {this.difficulty} stage with {this.moveErrors}{" "}
              errors in {this.state.gameTimer} time.
            </h2>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span>Match all cards in shortest time with fewer moves.</span>
            <div className="game-stats">
              <span>Elapsed Time: {this.state.gameTimer}</span>
              <span>Errors: {this.moveErrors}</span>
            </div>
            <div>
              {this.state.cards.map((card, cardIndex) => (
                <React.Fragment key={cardIndex}>
                  <button
                    style={{
                      visibility: this.solvedCards.includes(card.key)
                        ? "hidden"
                        : "visible",
                    }}
                    className={`flip-card${
                      this.state.selectedCardKeyIndex.includes(cardIndex)
                        ? " face-up"
                        : ""
                    }`}
                    type="button"
                    key={cardIndex}
                    disabled={
                      this.state.selectedCardKeyIndex.includes(cardIndex) ||
                      this.solvedCards.includes(card.key) ||
                      this.disabledClickOnCard
                    }
                    onClick={(cardClickEvent) =>
                      this.handleCardClick(card.key, cardIndex)
                    }
                  >
                    {this.state.selectedCardKeyIndex.includes(cardIndex) ||
                    this.solvedCards.includes(card.key)
                      ? card.value
                      : "FLIP"}
                  </button>
                  {(cardIndex + 1) % 4 === 0 ? <br /> : null}
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default MemoryGameLayout;
