#!/usr/bin/env python3

import curses
import datetime
import matplotlib.pyplot as plt
import numpy as np
from operator import itemgetter
import os


SCREEN = None
CELL_WIDTH = 8
INPUT_ROW = 0
TURN_SCORE_ROW = 4


def init_color_pairs():
    curses.init_pair(1, curses.COLOR_RED, curses.COLOR_BLACK)
    curses.init_pair(2, curses.COLOR_YELLOW, curses.COLOR_BLACK)
    curses.init_pair(3, curses.COLOR_GREEN, curses.COLOR_BLACK)


def clear_screen():
    SCREEN.clear()
    SCREEN.refresh()


def write_text_on_input_line(text: str, *args):
    '''Clear the input line and write the given text on it.'''
    SCREEN.move(INPUT_ROW, 0)
    SCREEN.clrtoeol()
    SCREEN.addstr(text, *args)


def show_error_and_wait(error_msg: str):
    '''Show an error message on the input line and wait for input'''
    write_text_on_input_line(
        'ERROR: ' + error_msg + ' (press any key to continue).',
        curses.color_pair(1) | curses.A_REVERSE,
    )
    SCREEN.getch()


def get_center_aligned_text_with_width(text: str, width: int):
    '''Get a width-long string containing text, left padded with spaces.'''
    spaces = width - len(text)
    left_side = spaces // 2
    return (' ' * left_side) + text[:width] + (' ' * (spaces - left_side))


class Farkel():
    def __init__(self):
        self.WINNING_SCORE = self.get_winning_score()
        clear_screen()

        self.players = self.get_player_names()
        clear_screen()

        self.current_turn = 0

        self.ROW_LENGTH = (
            CELL_WIDTH + len('|')                   # Turn-number column
            + (len('|') * (len(self.players) - 1))  # The '|'s between the cells
            + (CELL_WIDTH * len(self.players))      # The cells (names with centering whitespace)
        )

        # 0 = Not in yet
        # 1 = Got in on most recent turn
        # 2 = Got in at least 2 turns ago
        self.got_in = [0 for _ in self.players]

        self.turn_scores = [[] for _ in self.players]  # -1 indicates no points, but 'got in'
        self.cumulative_scores = [[] for _ in self.players]

    def get_winning_score(self):
        '''Input the score required to win the game.'''
        while True:
            try:
                write_text_on_input_line('How many points do you need in order to win? ')
                target = int(SCREEN.getstr())
                break
            except ValueError:
                show_error_and_wait('Please enter a valid number')

        return target

    def get_player_names(self):
        '''Input every player\'s name and return them as a list.'''
        while True:
            write_text_on_input_line('Enter players, in order, separated by \', \': ')
            players = SCREEN.getstr().decode().split(', ')

            if len(players) < 2:
                show_error_and_wait('Enter at least 2 player names')
                continue

            break

        return players

    def get_turn_scores(self):
        '''Get the most recent score for each player.'''
        return [
            player_turn_scores[-1]
            if (player_turn_scores and player_turn_scores[-1] != -1) else 0  # -1 = 'got in' but no points
            for player_turn_scores in self.turn_scores
        ]

    def get_current_scores(self):
        '''Get the score of the game right now.'''
        return [
            scores_list[-1] if scores_list else 0
            for scores_list in self.cumulative_scores
        ]

    def play_turn(self):
        '''Input every player\'s score this turn and update the scores.'''
        for index, player in enumerate(self.players):
            if not self.got_in[index]:
                while True:
                    write_text_on_input_line(f'Did {player} get in? y/n: ')
                    got_in = SCREEN.getstr().decode().lower()
                    if got_in in ('y', 'yes'):
                        self.got_in[index] = 1
                    elif got_in in ('n', 'no'):
                        pass
                    else:
                        show_error_and_wait('Please enter y/yes or n/no')
                        continue

                    score = 0
                    break
            else:
                while True:
                    try:
                        write_text_on_input_line(f'Enter {player}\'s score this turn: ')
                        score = int(SCREEN.getstr())
                        if score % 50 != 0:
                            show_error_and_wait('Score must be divisible by 50')
                            continue

                        if self.got_in[index] == 1:
                            self.got_in[index] = 2

                        break
                    except ValueError:
                        show_error_and_wait('Please put in a valid number')

            # Update turn_scores
            if self.got_in[index] == 1:
                self.turn_scores[index].append(-1)  # Mark this as the 'got in' turn
            else:
                self.turn_scores[index].append(score)

            # Update cumulative_scores
            self.cumulative_scores[index].append(
                score + self.cumulative_scores[index][-1] if len(self.cumulative_scores[index]) else 0
            )

        self.current_turn += 1

    def print_turn_score_row(self):
        '''Add a row to the table including the most recent turn's scores.'''
        SCREEN.move(TURN_SCORE_ROW, 0)
        SCREEN.addstr(get_center_aligned_text_with_width(str(self.current_turn), CELL_WIDTH))
        SCREEN.addstr('|')

        for player_index, score in enumerate(self.get_turn_scores()):
            color = curses.color_pair(0)

            if self.got_in[player_index] == 1:
                color = curses.color_pair(3)

            SCREEN.addstr(get_center_aligned_text_with_width(str(score), CELL_WIDTH), color)
            SCREEN.addstr('|')

        # Delete the last |
        cursor_loc = SCREEN.getyx()
        SCREEN.delch(cursor_loc[0], cursor_loc[1] - 1)

    # TODO: Not sure it makes sense to pass x and y here
    def print_scoreboard_header(self, y_pos: int, x_pos: int):
        names_line = '|'.join([
            get_center_aligned_text_with_width(player, CELL_WIDTH)
            for player in ['ROUND', *self.players]
        ])
        #  SCREEN.addstr('-' * len(names_line) + '\n')
        SCREEN.addstr(y_pos, x_pos, names_line + '\n')
        SCREEN.addstr(y_pos + 1, x_pos, '-' * self.ROW_LENGTH)

    def print_scoreboard_footer(self):
        '''Print/Update the scoreboard footer, which includes the players' total scores.'''
        scores = self.get_current_scores()
        leading_score = max(scores)
        trailing_score = min(scores)

        SCREEN.move(TURN_SCORE_ROW + 1, 0)
        SCREEN.addstr('-' * self.ROW_LENGTH + '\n')
        SCREEN.addstr(get_center_aligned_text_with_width('TOTAL', CELL_WIDTH))
        SCREEN.addstr('|')

        # Print score one by one, using color when needed
        if leading_score or (scores.count(trailing_score) == 1):
            for score in scores:
                if score == leading_score:
                    color = curses.color_pair(2)
                elif score == trailing_score:
                    color = curses.color_pair(1)
                else:
                    color = curses.color_pair(0)

                SCREEN.addstr(get_center_aligned_text_with_width(str(score), CELL_WIDTH), color)
                SCREEN.addstr('|')

            # Delete the last |
            cursor_loc = SCREEN.getyx()
            SCREEN.delch(cursor_loc[0], cursor_loc[1] - 1)

        # Print all scores in default color
        else:
            SCREEN.addstr('|'.join([
                get_center_aligned_text_with_width(str(score), CELL_WIDTH)
                for score in scores
            ]))

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

    def print_game_stats(self):
        '''Print end-of-game statistics.'''
        SCREEN.move(TURN_SCORE_ROW + 4, 0)

        # Biggest turn
        biggest_player, biggest_score = self.get_biggest_turn()
        SCREEN.addstr(f'\nMost points in one turn: {biggest_player} - {biggest_score}')

        # Longest bust streak
        longest_bust_player, longest_bust_streak = self.get_longest_bust_streak()
        SCREEN.addstr(f'\nLongest streak of busts in a row: {longest_bust_player} - {longest_bust_streak}')

    def draw_line_chart(self):
        '''Create a line chart which plots all player\'s points through the game.'''
        num_turns = len(self.cumulative_scores[0])

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
            plt.plot(
                turn_numbers,
                self.cumulative_scores[i],
                label=f'{self.players[i]}',
                linestyle=linestyles[i % 4]
            )

            # Add final score to the chart
            final_score = self.cumulative_scores[i][-1]
            score_text = plt.text(
                num_turns - 1,
                final_score,
                str(final_score),
                backgroundcolor='w',
                color='k'
            )
            score_text.set_bbox(dict(alpha=0.2))  # Make the background of the score transparent

        # Legend
        plt.legend(loc='upper left')

        plt.show()


def main(screen):
    farkel = None
    try:
        # * Curses *
        curses.start_color()
        init_color_pairs()
        curses.echo()

        global SCREEN, TURN_SCORE_ROW
        SCREEN = screen

        # * Setup *
        farkel = Farkel()
        farkel.print_scoreboard_header(2, 0)
        SCREEN.refresh()

        # * Main game loop *
        scores = farkel.get_current_scores()
        while all(score < farkel.WINNING_SCORE for score in scores):
            # Play the turn
            farkel.play_turn()

            # Print this round's scores
            farkel.print_turn_score_row()

            # Update the totals
            farkel.print_scoreboard_footer()

            SCREEN.refresh()

            TURN_SCORE_ROW += 1

            scores = farkel.get_current_scores()

        # * Game over *
        # Print winner message
        write_text_on_input_line(f'Game over - {farkel.players[scores.index(max(scores))]} wins!')
        # Print game stats
        farkel.print_game_stats()

        SCREEN.getch()
    except Exception:
        pass
    finally:
        return farkel

    return farkel


if __name__ == "__main__":
    farkel = curses.wrapper(main)

    # Need to leave curses terminal before showing the chart
    farkel.draw_line_chart()
