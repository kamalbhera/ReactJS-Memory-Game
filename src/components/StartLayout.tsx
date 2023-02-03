import React from "react";
import { History, LocationState } from "history";
import ErrorComponent from "../components/ErrorComponent";

interface IStartLayoutProps {
  history: History<LocationState>;
}

interface IStartLayoutState {}

class StartLayout extends React.Component<
  IStartLayoutProps,
  IStartLayoutState
> {
  private gameDifficultyLevels = [
    { difficulty: "Easy" },
    { difficulty: "Medium" },
    { difficulty: "Hard" },
  ];
  private selectedDifficulty = "Easy";
  public errorMessage: string = "";

  handleCardClick = (cardClickEvent: any): void => {
    this.selectedDifficulty = cardClickEvent.target.innerHTML.toLowerCase();
    this.props.history.push({
      pathname: "/game",
      search: `?difficulty=${this.selectedDifficulty}`,
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.errorMessage === "" ? null : (
          <ErrorComponent errorMessage={this.errorMessage} />
        )}
        <span>Please select game difficulty</span>
        <div>
          {this.gameDifficultyLevels.map(
            (difficultyLevel, difficultyLevelIndex) => (
              <button
                className="difficulty-selection"
                type="button"
                key={difficultyLevelIndex}
                onClick={(cardClickEvent) =>
                  this.handleCardClick(cardClickEvent)
                }
              >
                {difficultyLevel.difficulty}
              </button>
            )
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default StartLayout;
