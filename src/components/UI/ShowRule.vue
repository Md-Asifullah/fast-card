<template>
    <div class="backdrop" @click="closeDialog"></div>
    <dialog open>
        <header>
            <h2>{{ title }}</h2>
        </header>
        <div class="text-section">
            <h3>Objective</h3>
            <p>
                Win all the chips from your opponent to become the ultimate
                winner.
            </p>
            <h5>Setup:</h5>
            <p>
                Each player starts with 8 chips. The deck contains cards ranked
                from highest to lowest: Ace, King, Queen, Jack, 10, 9, 8, 7, 6,
                5, 4, 3, 2.
            </p>
            <h5>Gameplay:</h5>
            <p>
                At the beginning of each round, both players are randomly dealt
                a card from the deck. Based on the rank of their card, players
                must decide whether to bid chips or pass (fold) the round. If
                they choose to bid, they wager a specified number of chips. If
                they fold, they lose 1 chip. If both players decide to bid, they
                compare their cards, and the player with the higher-ranked card
                wins the round. The winner claims the chips wagered by the
                opponent, while the loser forfeits their bet. In the event of a
                draw, where both players have cards of the same rank, each
                player retains their chips. Players have the option to click the
                "Show" button at any point to challenge their opponent to reveal
                their cards by placing a higher bid. If a player's bid is lower
                and they have exhausted all their chips, they may choose to go
                "All In." During an "All In" action, both cards are revealed. If
                the player loses, the game is lost immediately. However, if the
                player wins an "All In" action, they receive half of the
                opponent's bid as a reward.
            </p>
            <h5>End of the Game:</h5>
            <p>
                The game continues until one player has won all 16 chips,
                thereby becoming the winner.
            </p>
            <h5>Additional Notes:</h5>
            <p>
                If a player runs out of chips, the player lose the game. Enjoy
                and may the best strategist win!
            </p>
        </div>
        <menu>
            <button @click="closeDialog" class="btn btn-danger">Close</button>
        </menu>
    </dialog>
</template>

<script>
export default {
    props: ['title'],
    emits: ['close'],
    methods: {
        closeDialog() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
p{
    font-size: 14px;
}
h2 {
    text-align: center;
}
.text-section {
    padding-left: 2rem;
    padding-right: 2rem;
}
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 10000;
}

h3,
h5 {
    color: #ad8816;
}

dialog {
    color: #e7e7e7;
    text-align: justify;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    position: fixed;
    top: 6vh;
    height: 88vh;
    left: 10vw;
    width: 80vw;
    background-color: #012c17e5;
    z-index: 10005;
    overflow: hidden;
}

header {
    width: 100%;
    padding: 1rem;
    background-color: #08683a;
    color: white;
}

dialog div {
    padding: 1rem;
}

menu {
    padding-top: 0;
    padding-right: 1rem;
    padding-left: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>
