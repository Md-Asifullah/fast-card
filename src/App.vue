<template>
    <show-rule
        v-if="rulesIsVisible"
        title="Rules for Playing Fast Card"
        @close="hideRules"
    ></show-rule>
    <div class="container-fluid text-center">
        <div class="row">
            <div class="col-4"></div>
            <div class="col-4">
                <img class="mt-2 logo" :src="logoImgSrc" alt="" />
            </div>
            <div class="col-4 text-end">
                <button
                    type="button"
                    class="btn btn-warning mt-4 me-4"
                    @click="showRules"
                >
                    Rules
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <chips-stock
                    type="player"
                    :remaining="playerChipsRemaining"
                ></chips-stock>
            </div>
            <div class="col-4 mt-3">
                <div v-if="showRound"><round-counter></round-counter></div>
            </div>
            <div class="col-4">
                <chips-stock
                    type="computer"
                    :remaining="computerChipsRemaining"
                ></chips-stock>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-3">
                <the-card :card="playerCard" :role="'Player'"></the-card>
            </div>
            <div class="col-6">
                <p class="text-white">Current Bids</p>
                <div class="row mt-5">
                    <div class="col-6">
                        <the-bid
                            :currentBid="playerCurrentBid"
                            :role="'player'"
                        ></the-bid>
                    </div>
                    <div class="col-6">
                        <the-bid
                            :currentBid="computerCurrentBid"
                            :role="'computer'"
                        ></the-bid>
                    </div>
                </div>
                <Transition name="fade-message">
                    <custom-message
                        :message="customMessage"
                        v-if="showCustomMessage"
                    ></custom-message>
                </Transition>
                <Transition name="fade-message">
                    <custom-message
                        message="💥 You’re all-in, but your bid is not above your opponent's. If you reveal and lose, game over. Win, and you get half of your opponents bid! 🃏"
                        v-if="
                            enableShowAnyWay &&
                            !disableShowAnyway &&
                            !gameStatusOver
                        "
                    ></custom-message>
                </Transition>
                <div>
                    <button
                        type="button"
                        class="btn btn-warning btn-lg"
                        @click="playAgain()"
                        v-if="gameStatusOver"
                    >
                        Play Again 🥳
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        class="btn btn-danger btn-lg"
                        @click="show('anyway')"
                        v-if="
                            enableShowAnyWay &&
                            !disableShowAnyway &&
                            !gameStatusOver
                        "
                    >
                        ⚠ Show Anyway 😎
                    </button>
                </div>
                <!--
                <div>
                    <button
                        type="button"
                        class="btn btn-danger btn-lg"
                        @click="stopTimeOut()"
                    >
                        STOP 🚫
                    </button>
                </div>
                -->
            </div>
            <div class="col-3">
                <the-card
                    :card="opponentCardDisplay"
                    :role="'Computer'"
                    :animate="animate"
                ></the-card>
            </div>
        </div>
    </div>

    <div class="container-fluid controls fixed-bottom">
        <div class="row">
            <div class="col">
                <Transition>
                    <div class="btn-group mt-1" v-if="showControlsPanel">
                        <button
                            type="button"
                            class="btn btn-light btn-lg"
                            @click="drawCards()"
                            :disabled="hidePlay ? 'disabled' : null"
                        >
                            Play
                        </button>
                        <button
                            type="button"
                            class="btn btn-light btn-lg"
                            @click="increaseBid()"
                            :disabled="
                                hideOptions || hideIncreaseOptions
                                    ? 'disabled'
                                    : null
                            "
                        >
                            + Bid
                        </button>
                        <button
                            type="button"
                            class="btn btn-light btn-lg"
                            @click="decreaseBid()"
                            :disabled="hideOptions ? 'disabled' : null"
                        >
                            - Bid
                        </button>
                        <button
                            type="button"
                            class="btn btn-light btn-lg"
                            @click="show('normal')"
                            :disabled="
                                hideOptions ||
                                playerCurrentBid <= computerCurrentBid
                                    ? 'disabled'
                                    : null
                            "
                        >
                            Show
                        </button>
                        <button
                            type="button"
                            class="btn btn-light btn-lg"
                            @click="fold()"
                            :disabled="hideOptions ? 'disabled' : null"
                        >
                            Fold
                        </button>
                    </div> </Transition
                ><br />
                <p class="mt-1">
                    Fast Card version 1.3. A fun project developed by
                    <a target="_blank" class="creditLink" href="https://artisanasif.com/">Asif</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import ChipsStock from './components/chips/ChipsStock.vue';
import TheCard from './components/cards/TheCard.vue';
import TheBid from './components/chips/TheBid.vue';
import CustomMessage from './components/UI/CustomMessage.vue';
import ShowRule from './components/UI/ShowRule.vue';
import RoundCounter from './components/UI/RoundCounter.vue';

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    components: {
        ChipsStock,
        TheCard,
        TheBid,
        CustomMessage,
        ShowRule,
        RoundCounter,
    },
    data() {
        return {
            rulesIsVisible: false,
            showControlsPanel: true,
            logoImgSrc: require('@/assets/Fast Card Logo.png'),
            // Chips counter
            playerChipsRemaining: 8,
            computerChipsRemaining: 8,
            // Cards
            playerCard: 'start_01',
            opponentCard: '',
            opponentCardDisplay: 'start_02',
            // Bids
            playerCurrentBid: 0,
            computerBid: 0,
            computerCurrentBid: 0,
            // Ranks
            playerCardRank: '',
            opponentCardRank: '',
            // Animation
            animate: false,
            hideOptions: true,
            hidePlay: false,
            // Confidence
            confidence: 0,
            // Custom Message
            showCustomMessage: false,
            customMessage: null,

            opponentFolded: false,
            // Fold Related
            hasFolded: false,
            hideFoldOption: true,
            // Game Over
            gameStatusOver: false,
            // TimeOut
            timeout: null,
            stopTimeout: false,
            // Loop Mechanism
            counter: 0,
            maxIterations: 0,
            disableShowAnyway: false,
            showRound: false,
            showAnyway: false,
            showMode: false,
        };
    },
    computed: {
        hideIncreaseOptions() {
            if (this.playerCurrentBid > this.computerCurrentBid) {
                return true;
            } else {
                return false;
            }
        },
        enableShowAnyWay() {
            if (
                this.playerChipsRemaining == 0 &&
                this.playerCurrentBid <= this.computerCurrentBid
            ) {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        showRules() {
            this.rulesIsVisible = true;
        },
        hideRules() {
            this.rulesIsVisible = false;
        },
        stopTimeOut() {
            this.stopTimeout = true;
        },
        playAgain() {
            location.reload();
        },
        drawCards() {
            this.showMode = false;
            this.showAnyway = false;
            this.showRound = true;
            this.$store.commit('incrementRound');
            this.disableShowAnyway = false;
            // console.log(this.hideOptions);
            // console.log(this.hideFoldOption);

            // this.hideOptions = false;
            if (this.computerChipsRemaining <= 0) {
                this.gameOver('won');
                return;
            }
            if (this.playerChipsRemaining <= 0) {
                this.gameOver('lost');
                return;
            }
            this.playerCurrentBid = 1;
            this.playerChipsRemaining--;
            this.computerCurrentBid = 1;
            this.computerChipsRemaining--;

            // console.log(
            //     '💎 playerCurrentBid: ' +
            //         this.playerCurrentBid +
            //         ', ' +
            //         ' playerChipsRemaining: ' +
            //         this.playerChipsRemaining +
            //         ', ' +
            //         ' computerCurrentBid: ' +
            //         this.computerCurrentBid +
            //         ', ' +
            //         ' computerChipsRemaining: ' +
            //         this.computerChipsRemaining +
            //         ', '
            // );
            // console.log(
            //     '🌯 computerChipsRemaining:' + this.computerChipsRemaining
            // );
            this.hideIncreaseBid = false;
            this.stopTimeout = false;
            this.opponentFolded = false;
            // console.log('Draw some cards!!! Line 1');
            this.showCustomMessage = false;
            this.customMessage = null;
            this.hasFolded = false;
            this.opponentCardDisplay = 'start_02';
            this.getCardAction();
            this.animate = false;
            this.hideOptions = false;
            this.hidePlay = true;

            // console.log('Draw some cards!!! Line 10');
            this.computerBid = Math.floor(this.dummyAi());
            // console.log(
            //     'Results of dummyAI from within Show Method:',
            //     this.computerBid
            // );
            this.opponentBid();
            if (this.opponentFolded) {
                this.opponentFoldedAction();
            }
        },
        getCardAction() {
            // console.log('INSIDE GET CARD ACTION');
            this.playerCard = this.getARandomCard('player');
            do {
                this.opponentCard = this.getARandomCard('oppenent');
                // console.log('AAAA');
            } while (this.playerCard == this.opponentCard);
        },
        opponentBid() {
            // console.log('Confidence: ' + this.confidence);

            if (this.confidence < 40) {
                const move = getRandomNumber(1, 2);
                if (move == 1 && this.computerChipsRemaining > 1) {
                    // Fold at initial
                    this.showCustomMessage = true;
                    // console.log('🧪 Opponent folded the card');
                    this.customMessage =
                        "😐 Nah! I don't want to proceed! Let's fold!";
                    this.opponentFolded = true;
                    return;
                } else {
                    this.continueBiddingOpponent();
                }
            } else {
                this.continueBiddingOpponent();
            }
        },
        continueBiddingOpponent() {
            // Continue
            // const move = getRandomNumber(1, 3);
            // console.log('Move: ' + move);
            // 1 - Full on bid
            // 2 - Bid based on Opponent full
            // 3 - Bid based on Opponent Half

            // console.log('⛳' + this.computerBid);
            this.counter = 0;
            this.maxIterations = this.computerBid;
            // for (let i = 0; i < this.computerBid; i++) {
            //     this.timeout = setTimeout(() => {
            //         if (this.hasFolded) {
            //             clearTimeout(this.timeout);
            //             return;
            //         }
            //         this.opponentBiddingOperation();
            //     }, (i + 1) * 1500);
            // }
            this.runLoop();
        },
        runLoop() {
            if (this.counter >= this.maxIterations) {
                return;
            }
            if (this.stopTimeout) {
                return;
            }
            if (this.showAnyway) {
                return;
            }
            if (this.showMode) {
                return;
            }
            this.opponentBiddingOperation();
            this.counter++;
            setTimeout(this.runLoop, 1500);
        },
        opponentBiddingOperation() {
            // console.log('opponentBiddingOperation');
            // 🔥 Newly Implemented Fix
            if (this.computerChipsRemaining > 0) {
                this.computerChipsRemaining--;
                this.computerCurrentBid++;
            }
        },
        increaseBid() {
            if (this.playerChipsRemaining > 0) {
                this.showCustomMessage = false;
                this.customMessage = null;
                this.playerChipsRemaining--;
                this.playerCurrentBid++;
            }
            if (this.playerChipsRemaining == 0) {
                this.showCustomMessage = true;
                this.customMessage = 'You are all in 😎';
            }
        },
        decreaseBid() {
            if (this.playerCurrentBid > 1) {
                this.playerChipsRemaining++;
                this.playerCurrentBid--;
                this.showCustomMessage = false;
                this.customMessage = null;
            }
        },
        fold() {
            this.disableShowAnyway = false;
            this.stopTimeOut();
            this.hasFolded = true;
            if (this.playerChipsRemaining === 0 && this.playerCurrentBid < 2) {
                this.gameOver('lost');
                return;
            }
            this.playerChipsRemaining += this.playerCurrentBid;
            this.computerChipsRemaining =
                this.computerChipsRemaining + this.computerCurrentBid;
            this.playerChipsRemaining--;
            this.computerChipsRemaining++;
            this.playerCurrentBid = 0;
            this.computerCurrentBid = 0;
            this.playerCard = 'start_01';
            this.hideOptions = true;
            this.hidePlay = false;
        },
        opponentFoldedAction() {
            this.stopTimeOut();
            this.hasFolded = true;
            if (
                this.computerChipsRemaining === 0 &&
                this.computerCurrentBid < 2
            ) {
                this.gameOver('win');
                return;
            }
            this.playerChipsRemaining += this.playerCurrentBid;
            this.computerChipsRemaining += this.computerCurrentBid;
            this.computerChipsRemaining--;
            this.playerChipsRemaining++;
            this.playerCurrentBid = 0;
            this.computerCurrentBid = 0;
            this.playerCard = 'start_01';
            this.hideOptions = true;
            this.hidePlay = false;
        },
        show(type) {
            // ⭐
            this.showMode = true;
            this.showCustomMessage = false;
            if (type == 'anyway') {
                this.disableShowAnyway = true;
                this.showAnyway = true;
            }

            this.animate = true;
            this.opponentCardDisplay = this.opponentCard;
            this.hideOptions = true;
            this.hidePlay = false;

            // Main Logics and Calculation

            if (this.playerCardRank == this.opponentCardRank) {
                setTimeout(() => {
                    this.playerChipsRemaining += this.playerCurrentBid;
                    this.computerChipsRemaining += this.computerCurrentBid;
                    this.playerCurrentBid = 0;
                    this.computerCurrentBid = 0;
                }, 2500);

                this.showCustomMessage = true;
                this.customMessage = "Wow! It's a draw! 👊";
            } else if (this.playerCardRank > this.opponentCardRank) {
                // WON
                setTimeout(() => {
                    // console.log('🍭First check');
                    // console.log('TIMEOUT 💀');
                    if (type == 'anyway') {
                        // console.log(
                        //     '🐜 coumputerChipsRemaning:' +
                        //         this.computerChipsRemaining
                        // );
                        const computerCurrentBid = this.computerCurrentBid;
                        // console.log(
                        //     '🐛 computerCurrentBid:' + computerCurrentBid
                        // );

                        const half = parseInt(computerCurrentBid / 2);
                        // const playerCurrentBid = this.playerCurrentBid;
                        // if(){

                        // }
                        // console.log('🐛 half:' + half);
                        const chipsBackToCoumputer = computerCurrentBid - half;
                        // console.log(
                        //     '🐛 chipsBackToCoumputer:' + chipsBackToCoumputer
                        // );
                        let playerChipsRemaining = this.playerCurrentBid + half;
                        if (playerChipsRemaining >= 0) {
                            this.playerChipsRemaining = playerChipsRemaining;
                        } else {
                            this.playerChipsRemaining = 0;
                        }
                        let computerChipsRemaining =
                            this.computerChipsRemaining + chipsBackToCoumputer;
                        if (computerChipsRemaining >= 0) {
                            this.computerChipsRemaining =
                                computerChipsRemaining;
                        } else {
                            this.computerChipsRemaining = 0;
                        }
                    } else {
                        let playerChipsRemaining =
                            this.playerChipsRemaining +
                            this.playerCurrentBid +
                            this.computerCurrentBid;
                        if (playerChipsRemaining >= 0) {
                            this.playerChipsRemaining = playerChipsRemaining;
                        } else {
                            this.playerChipsRemaining = 0;
                        }
                        let computerChipsRemaining =
                            this.computerChipsRemaining;
                        if (computerChipsRemaining >= 0) {
                            this.computerChipsRemaining =
                                computerChipsRemaining;
                        } else {
                            this.computerChipsRemaining = 0;
                        }
                    }
                    this.playerCurrentBid = 0;
                    this.computerCurrentBid = 0;
                    // console.log(
                    //     '🐜 coumputerChipsRemaning:' +
                    //         this.computerChipsRemaining
                    // );
                    // console.log('🍭Last check');
                    if (this.computerChipsRemaining == 0) {
                        this.gameOver('won');
                        return;
                    }
                }, 2500);
                // console.log(
                //     '🐜 coumputerChipsRemaning:' + this.computerChipsRemaining
                // );
                // console.log('🍭Last check');
                // if (this.computerChipsRemaining == 0) {
                //     this.gameOver('won');
                // }
            } else {
                // Lost
                setTimeout(() => {
                    // console.log('TIMEOUT 💀');
                    const computerChipsRemaining =
                        this.computerChipsRemaining +
                        this.computerCurrentBid +
                        this.playerCurrentBid;
                    if (computerChipsRemaining >= 0) {
                        this.computerChipsRemaining = computerChipsRemaining;
                    } else {
                        this.computerChipsRemaining = 0;
                    }

                    const playerChipsRemaining = this.playerChipsRemaining;
                    if (playerChipsRemaining >= 0) {
                        this.playerChipsRemaining = playerChipsRemaining;
                    } else {
                        this.playerChipsRemaining = 0;
                    }

                    // this.playerChipsRemaining--;
                    this.playerCurrentBid = 0;
                    this.computerCurrentBid = 0;
                }, 2500);
                if (this.playerChipsRemaining == 0 && type != 'anyway') {
                    this.gameOver('lost');
                }
                if (this.playerChipsRemaining == 0) {
                    this.gameOver('lost');
                }
            }
        },
        dummyAi() {
            if (this.opponentCardRank === 14) {
                this.confidence = 100;
            } else {
                this.confidence = (this.opponentCardRank / 14) * 100;
            }
            const confidenceChips =
                (this.confidence / 100) * this.computerChipsRemaining;
            const move = getRandomNumber(1, 10);

            let acutalChipUsed = '';
            if (this.confidence === 100) {
                acutalChipUsed = this.computerChipsRemaining;
            } else if (this.confidence >= 85) {
                acutalChipUsed =
                    this.computerChipsRemaining - getRandomNumber(1, 2);
            } else {
                if (move >= 8) {
                    // Bluff
                    acutalChipUsed = getRandomNumber(
                        1,
                        this.computerChipsRemaining
                    );
                } else if (move >= 6) {
                    // Increase
                    const increase = getRandomNumber(1, 2);
                    if (
                        confidenceChips + increase <
                        this.computerChipsRemaining
                    ) {
                        acutalChipUsed = confidenceChips + increase;
                    } else {
                        acutalChipUsed = confidenceChips;
                    }
                } else if (move >= 4) {
                    // Decrease
                    const decrease = getRandomNumber(1, 2);
                    if (confidenceChips - decrease > 1) {
                        acutalChipUsed = confidenceChips - decrease;
                    } else {
                        acutalChipUsed = confidenceChips;
                    }
                } else {
                    // Continue
                    acutalChipUsed = confidenceChips;
                }
            }

            // console.log('Confidence: ' + confidence);
            // console.log('Move:' + move);
            // console.log('confidenceChips:' + Math.round(confidenceChips));
            // console.log('action:' + action);
            // console.log('actualChipUsed:' + Math.round(acutalChipUsed));
            return acutalChipUsed;
        },
        gameOver(result) {
            this.stopTimeOut();
            this.hideOptions = true;
            this.hidePlay = true;
            if (result === 'lost') {
                this.gameStatusOver = true;
                this.showCustomMessage = true;
                this.customMessage =
                    'You have lost the game. 🤣. Care to have another go?';
            } else {
                this.gameStatusOver = true;
                this.showCustomMessage = true;
                if (this.opponentFolded) {
                    this.customMessage =
                        'Opponent has folded! 😆. Congratulations! You have won the game! 🤣';
                } else {
                    this.customMessage =
                        'Congratulations! You have won the game! 🤣';
                }
            }
        },
        getARandomCard(user) {
            const type = getRandomNumber(1, 4);
            const number = getRandomNumber(2, 14);
            if (user == 'player') {
                this.playerCardRank = number;
            } else {
                this.opponentCardRank = number;
            }

            let cardType = '';
            switch (type) {
                case 1:
                    cardType = 'hearts';
                    break;
                case 2:
                    cardType = 'diamonds';
                    break;
                case 3:
                    cardType = 'clubs';
                    break;
                case 4:
                    cardType = 'spades';
                    break;
                default:
                    cardType = 'error';
                    break;
            }

            let cardNumber = '';
            // Switch statement
            switch (number) {
                case 2:
                    cardNumber = '2';
                    break;
                case 3:
                    cardNumber = '3';
                    break;
                case 4:
                    cardNumber = '4';
                    break;
                case 5:
                    cardNumber = '5';
                    break;
                case 6:
                    cardNumber = '6';
                    break;
                case 7:
                    cardNumber = '7';
                    break;
                case 8:
                    cardNumber = '8';
                    break;
                case 9:
                    cardNumber = '9';
                    break;
                case 10:
                    cardNumber = '10';
                    break;
                case 11:
                    cardNumber = 'jack';
                    break;
                case 12:
                    cardNumber = 'queen';
                    break;
                case 13:
                    cardNumber = 'king';
                    break;
                case 14:
                    cardNumber = 'ace';
                    break;
                default:
                    cardNumber = 'invalid';
                    break;
            }
            return cardType + '-' + cardNumber;
        },
    },
    mounted() {
        this.showControlsPanel = true;
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
body {
    background-color: #08683a;
}
.logo{
    width: 350px;
}
.round-text {
    font-family: 'Poppins', sans-serif;
    font-weight: 300;
}
.controls {
    background-color: #ad8816;
    color: #fff;
    height: 120px;
    display: flex;
    align-items: center; /* Center vertically */
    justify-content: center; /* Center horizontally */
}
.creditLink{
    color: #000;
    font-weight: 500;
    text-decoration: none;
}
.v-enter-active,
.v-leave-active {
    transition: opacity 2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.fade-message-enter-active,
.fade-message-leave-active {
    transition: opacity 1.5s ease;
}

.fade-message-enter-from,
.fade-message-leave-to {
    opacity: 0;
}
</style>
