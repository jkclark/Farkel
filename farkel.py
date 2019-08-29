#!/usr/bin/env python3

import datetime
import matplotlib.pyplot as plt
import numpy as np
from operator import itemgetter
import os

winning_score = 10000


def _get_winning_score():
    '''Input the score required to win the game.'''
    global winning_score

    while True:
        try:
            target = input('How many points do you need in order to win?\n')
            target = int(target)
            break
        except ValueError:
            print('Error: Please put in a valid number.')

    return target


def _get_player_names():
    '''Input every player\'s name and return them as a list.'''
    players = input('Enter players, in order, separated by \', \':\n')
    players = players.split(', ')

    for player in players:
        player = str(player)
        print("Player:", player)

    return players


def _get_current_scores(cumulative_scores):
    '''Get the score of the game right now.'''
    return [
        scores_list[-1] if len(scores_list) else 0
        for scores_list in cumulative_scores
    ]


def _play_turn(players, turn_scores, cumulative_scores):
    '''Input every player\'s score this turn and update the scores.'''
    for index in range(len(players)):
        while True:
            try:
                score = input(f'Enter {players[index]}\'s score this turn: ')
                score = int(score)
                break
            except ValueError:
                print('Error: Please put in a valid number.')

        # Update turn_scores
        turn_scores[index].append(int(score))

        # Update cumulative_scores
        if len(cumulative_scores[index]):
            previous_score = cumulative_scores[index][-1]
        else:
            previous_score = 0
        cumulative_scores[index].append(int(score) + previous_score)


def _print_score(players, cumulative_scores):
    '''Print a scoreboard with the current scores.'''
    current_scores = _get_current_scores(cumulative_scores)
    combined = zip(players, current_scores)
    combined = reversed(sorted(combined, key=itemgetter(1)))
    for player_score in combined:
        print(f'{player_score[0]}: {player_score[1]}')


def _draw_line_chart(players, cumulative_scores):
    '''Create a line chart which plots all player\'s points through the game.'''
    num_turns = len(cumulative_scores[0])

    # * Labels, tick marks, etc. *
    # Title
    now = datetime.datetime.now()
    date = now.strftime('%m/%d/%Y')
    time = now.strftime('%I:%M %p')
    plt.title(f'Farkel - {date} {time}')

    # x-axis
    plt.xticks(np.arange(0, num_turns + 1, 1.0))

    # y-axis
    global winning_score
    plt.yticks(np.arange(0, winning_score + 1000, 1000))

    # Data
    turn_numbers = [i for i in range(num_turns)]

    linestyles = ['solid', 'dashed', 'dashdot', 'dotted']
    for i in range(len(players)):
        current_player_turns = cumulative_scores[i]
        plt.plot(turn_numbers, current_player_turns,
                 label=f'{players[i]}',
                 linestyle=linestyles[i % 4]
                 )

        # Add final score to the chart
        final_score = cumulative_scores[i][-1]
        plt.text(num_turns - 1, final_score, str(final_score),
                 backgroundcolor='w',
                 color='k')

    # Legend
    plt.legend(loc='upper left')

    plt.show()


def _get_biggest_turn(players, turn_scores):
    '''Find the most points earned in one turn and the corresponding player.'''
    biggest_turn_score = -1
    biggest_turn_player = None
    for index in range(len(players)):
        biggest_player_score = max(turn_scores[index])
        if biggest_player_score > biggest_turn_score:
            biggest_turn_score = biggest_player_score
            biggest_turn_player = players[index]

    return biggest_turn_player, biggest_turn_score


def _get_longest_bust_streak(players, turn_scores):
    '''Find the most consecutive turns without points and the corresponding player.'''
    longest_bust_streak = 0
    longest_bust_player = None
    for p_index in range(len(players)):
        current = turn_scores[p_index]
        streak = 0
        for t_index in range(len(current)):
            if current[t_index] == 0:
                streak += 1
            else:
                if streak > longest_bust_streak:
                    longest_bust_streak = streak
                    longest_bust_player = players[p_index]
                streak = 0

        if streak > longest_bust_streak:
            longest_bust_streak = streak
            longest_bust_player = players[p_index]
        streak = 0

    return longest_bust_player, longest_bust_streak


def main():
    # * Setup *
    # Allow players to input score target
    global winning_score
    winning_score = _get_winning_score()

    # Request player players (in order)
    players = _get_player_names()

    # Set up lists for scores
    turn_scores = [[] for player in players]
    cumulative_scores = [[] for player in players]

    # * Main game loop *
    turn_number = 1
    scores = _get_current_scores(cumulative_scores)
    while not any(score >= winning_score for score in scores):
        print(f'------- Beginning of Turn {turn_number} -------')

        # Play the turn
        _play_turn(players, turn_scores, cumulative_scores)

        # Clear the terminal
        os.system('clear')

        # Print the score
        print(f"------- Scoreboard -------")
        _print_score(players, cumulative_scores)

        scores = _get_current_scores(cumulative_scores)

        print(f'------- End of Turn {turn_number} -------')

        turn_number += 1

    # * Game over *
    # Print winner message
    winner = players[scores.index(max(scores))]
    print(f'\nGame over - {winner} wins!')

    input('\nPress ENTER to see final statistics')

    # * Show final statistics *
    os.system('clear')

    # Final scoreboard
    print(f'------- Final Scores -------')
    _print_score(players, cumulative_scores)

    # Biggest turn
    biggest_player, biggest_score = _get_biggest_turn(players, turn_scores)
    print(f'\nMost points in one turn: {biggest_player} - {biggest_score}')

    # Longest bust streak
    longest_bust_player, longest_bust_streak = _get_longest_bust_streak(players, turn_scores)
    print(f'\nLongest streak of busts in a row: {longest_bust_player} - {longest_bust_streak}')

    # * Show line graph *
    _draw_line_chart(players, cumulative_scores)


if __name__ == "__main__":
    main()
