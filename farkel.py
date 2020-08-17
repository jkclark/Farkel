#!/usr/bin/env python3

import datetime
import matplotlib.pyplot as plt
import numpy as np
from operator import itemgetter
import os


class Farkel():
    def __init__(self):
        self.WINNING_SCORE = self.get_winning_score()

        self.players = self.get_player_names()
        self.turn_scores = [[] for player in self.players]
        self.cumulative_scores = [[] for player in self.players]

    def get_winning_score(self):
        '''Input the score required to win the game.'''
        while True:
            try:
                target = input('How many points do you need in order to win?\n')
                target = int(target)
                break
            except ValueError:
                print('Error: Please put in a valid number.')

        return target

    def get_player_names(self):
        '''Input every player\'s name and return them as a list.'''
        players = input('Enter players, in order, separated by \', \':\n')
        players = players.split(', ')

        for player in players:
            player = str(player)
            print("Player:", player)

        return players

    def get_current_scores(self):
        '''Get the score of the game right now.'''
        return [
            scores_list[-1] if len(scores_list) else 0
            for scores_list in self.cumulative_scores
        ]

    def play_turn(self):
        '''Input every player\'s score this turn and update the scores.'''
        for index in range(len(self.players)):
            while True:
                try:
                    score = input(f'Enter {self.players[index]}\'s score this turn: ')
                    score = int(score)
                    if score % 50 != 0:
                        print('Error: Score must be divisible by 50.')
                        continue
                    break
                except ValueError:
                    print('Error: Please put in a valid number.')

            # Update turn_scores
            self.turn_scores[index].append(int(score))

            # Update cumulative_scores
            if len(self.cumulative_scores[index]):
                previous_score = self.cumulative_scores[index][-1]
            else:
                previous_score = 0
            self.cumulative_scores[index].append(int(score) + previous_score)

    def print_score(self):
        '''Print a scoreboard with the current scores.'''
        current_scores = self.get_current_scores()
        combined = zip(self.players, current_scores)
        combined = reversed(sorted(combined, key=itemgetter(1)))
        for player_score in combined:
            print(f'{player_score[0]}: {player_score[1]}')

    def draw_line_chart(self):
        '''Create a line chart which plots all player\'s points through the game.'''
        num_turns = len(self.cumulative_scores[0])

        # * Labels, tick marks, etc. *
        # Title
        now = datetime.datetime.now()
        date = now.strftime('%m/%d/%Y')
        time = now.strftime('%I:%M %p')
        plt.title(f'Farkel - {date} {time}')

        # x-axis
        plt.xticks(np.arange(0, num_turns + 1, 1.0))

        # y-axis
        plt.yticks(np.arange(0, self.WINNING_SCORE + 1000, 1000))

        # Data
        turn_numbers = [i for i in range(num_turns)]

        linestyles = ['solid', 'dashed', 'dashdot', 'dotted']
        for i in range(len(self.players)):
            current_player_turns = self.cumulative_scores[i]
            plt.plot(turn_numbers, current_player_turns, label=f'{self.players[i]}', linestyle=linestyles[i % 4])

            # Add final score to the chart
            final_score = self.cumulative_scores[i][-1]
            plt.text(num_turns - 1, final_score, str(final_score), backgroundcolor='w', color='k')

        # Legend
        plt.legend(loc='upper left')

        plt.show()

    def get_biggest_turn(self):
        '''Find the most points earned in one turn and the corresponding player.'''
        biggest_turn_score = -1
        biggest_turn_player = None
        for index in range(len(self.players)):
            biggest_player_score = max(self.turn_scores[index])
            if biggest_player_score > biggest_turn_score:
                biggest_turn_score = biggest_player_score
                biggest_turn_player = self.players[index]

        return biggest_turn_player, biggest_turn_score

    def get_longest_bust_streak(self):
        '''Find the most consecutive turns without points and the corresponding player.'''
        longest_bust_streak = 0
        longest_bust_player = None
        for p_index in range(len(self.players)):
            current = self.turn_scores[p_index]
            streak = 0
            for t_index in range(len(current)):
                if current[t_index] == 0:
                    streak += 1
                else:
                    if streak > longest_bust_streak:
                        longest_bust_streak = streak
                        longest_bust_player = self.players[p_index]
                    streak = 0

            if streak > longest_bust_streak:
                longest_bust_streak = streak
                longest_bust_player = self.players[p_index]
            streak = 0

        return longest_bust_player, longest_bust_streak


def main():
    # * Setup *
    farkel = Farkel()

    # * Main game loop *
    turn_number = 1
    scores = farkel.get_current_scores()
    while not any(score >= farkel.WINNING_SCORE for score in scores):
        print(f'------- Beginning of Turn {turn_number} -------')

        # Play the turn
        farkel.play_turn()

        # Clear the terminal
        os.system('clear')

        # Print the score
        print("------- Scoreboard -------")
        farkel.print_score()

        scores = farkel.get_current_scores()

        print(f'------- End of Turn {turn_number} -------')

        turn_number += 1

    # * Game over *
    # Print winner message
    winner = farkel.players[scores.index(max(scores))]
    print(f'\nGame over - {winner} wins!')

    input('\nPress ENTER to see final statistics')

    # * Show final statistics *
    os.system('clear')

    # Final scoreboard
    print('------- Final Scores -------')
    farkel.print_score()

    # Biggest turn
    biggest_player, biggest_score = farkel.get_biggest_turn()
    print(f'\nMost points in one turn: {biggest_player} - {biggest_score}')

    # Longest bust streak
    longest_bust_player, longest_bust_streak = farkel.get_longest_bust_streak()
    print(f'\nLongest streak of busts in a row: {longest_bust_player} - {longest_bust_streak}')

    # * Show line graph *
    farkel.draw_line_chart()


if __name__ == "__main__":
    main()
