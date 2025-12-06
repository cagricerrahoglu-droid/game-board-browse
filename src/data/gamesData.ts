import { GameCardProps } from "@/components/GameCard";

// Import all game images
import catanImg from "@/assets/games/catan.jpg";
import ticketToRideImg from "@/assets/games/ticket-to-ride.jpg";
import wingspanImg from "@/assets/games/wingspan.jpg";
import terraformingMarsImg from "@/assets/games/terraforming-mars.jpg";
import sevenWondersImg from "@/assets/games/7-wonders.jpg";
import azulImg from "@/assets/games/azul.jpg";
import splendorImg from "@/assets/games/splendor.jpg";
import kingdominoImg from "@/assets/games/kingdomino.jpg";
import dixitImg from "@/assets/games/dixit.jpg";
import sushiGoImg from "@/assets/games/sushi-go.jpg";
import sevenWondersDuelImg from "@/assets/games/7-wonders-duel.jpg";
import patchworkImg from "@/assets/games/patchwork.jpg";
import jaipurImg from "@/assets/games/jaipur.jpg";
import codenamesDuetImg from "@/assets/games/codenames-duet.jpg";
import starRealmsImg from "@/assets/games/star-realms.jpg";
import codenamesImg from "@/assets/games/codenames.jpg";
import wavelengthImg from "@/assets/games/wavelength.jpg";
import justOneImg from "@/assets/games/just-one.jpg";
import telestrationsImg from "@/assets/games/telestrations.jpg";
import theResistanceImg from "@/assets/games/the-resistance.jpg";
import carcassonneImg from "@/assets/games/carcassonne.jpg";
import loveLetterImg from "@/assets/games/love-letter.jpg";
import unoImg from "@/assets/games/uno.jpg";
import dobbleImg from "@/assets/games/dobble.jpg";
import explodingKittensImg from "@/assets/games/exploding-kittens.jpg";
import pandemicImg from "@/assets/games/pandemic.jpg";
import spiritIslandImg from "@/assets/games/spirit-island.jpg";
import theCrewImg from "@/assets/games/the-crew.jpg";
import hanabiImg from "@/assets/games/hanabi.jpg";
import mysteriumImg from "@/assets/games/mysterium.jpg";

export const strategyGames: GameCardProps[] = [
  {
    id: "catan",
    title: "Catan",
    imageUrl: catanImg,
    players: "3-4",
    duration: "60-120",
    difficulty: "Medium",
    rating: 4.5,
    availability: "available",
    pricePerDay: 3.50,
  },
  {
    id: "ticket-to-ride",
    title: "Ticket to Ride",
    imageUrl: ticketToRideImg,
    players: "2-5",
    duration: "30-60",
    difficulty: "Easy",
    rating: 4.7,
    availability: "available",
    pricePerDay: 3.00,
  },
  {
    id: "wingspan",
    title: "Wingspan",
    imageUrl: wingspanImg,
    players: "1-5",
    duration: "40-70",
    difficulty: "Medium",
    rating: 4.8,
    availability: "limited",
    pricePerDay: 4.00,
  },
  {
    id: "terraforming-mars",
    title: "Terraforming Mars",
    imageUrl: terraformingMarsImg,
    players: "1-5",
    duration: "120+",
    difficulty: "Hard",
    rating: 4.6,
    availability: "available",
    pricePerDay: 4.50,
  },
  {
    id: "7-wonders",
    title: "7 Wonders",
    imageUrl: sevenWondersImg,
    players: "2-7",
    duration: "30-45",
    difficulty: "Medium",
    rating: 4.4,
    availability: "available",
    pricePerDay: 3.50,
  },
];

export const familyGames: GameCardProps[] = [
  {
    id: "azul",
    title: "Azul",
    imageUrl: azulImg,
    players: "2-4",
    duration: "30-45",
    difficulty: "Easy",
    rating: 4.6,
    availability: "available",
    pricePerDay: 3.00,
  },
  {
    id: "splendor",
    title: "Splendor",
    imageUrl: splendorImg,
    players: "2-4",
    duration: "30",
    difficulty: "Easy",
    rating: 4.5,
    availability: "available",
    pricePerDay: 2.50,
  },
  {
    id: "kingdomino",
    title: "Kingdomino",
    imageUrl: kingdominoImg,
    players: "2-4",
    duration: "15-20",
    difficulty: "Easy",
    rating: 4.3,
    availability: "limited",
    pricePerDay: 2.00,
  },
  {
    id: "dixit",
    title: "Dixit",
    imageUrl: dixitImg,
    players: "3-6",
    duration: "30",
    difficulty: "Easy",
    rating: 4.4,
    availability: "available",
    pricePerDay: 2.50,
  },
  {
    id: "sushi-go",
    title: "Sushi Go!",
    imageUrl: sushiGoImg,
    players: "2-5",
    duration: "15",
    difficulty: "Easy",
    rating: 4.2,
    availability: "available",
    pricePerDay: 1.50,
  },
];

export const twoPlayerGames: GameCardProps[] = [
  {
    id: "7-wonders-duel",
    title: "7 Wonders Duel",
    imageUrl: sevenWondersDuelImg,
    players: "2",
    duration: "30",
    difficulty: "Medium",
    rating: 4.8,
    availability: "available",
    pricePerDay: 3.00,
  },
  {
    id: "patchwork",
    title: "Patchwork",
    imageUrl: patchworkImg,
    players: "2",
    duration: "15-30",
    difficulty: "Easy",
    rating: 4.5,
    availability: "available",
    pricePerDay: 2.00,
  },
  {
    id: "jaipur",
    title: "Jaipur",
    imageUrl: jaipurImg,
    players: "2",
    duration: "30",
    difficulty: "Easy",
    rating: 4.4,
    availability: "limited",
    pricePerDay: 2.00,
  },
  {
    id: "codenames-duet",
    title: "Codenames Duet",
    imageUrl: codenamesDuetImg,
    players: "2",
    duration: "15-30",
    difficulty: "Easy",
    rating: 4.3,
    availability: "available",
    pricePerDay: 2.50,
  },
  {
    id: "star-realms",
    title: "Star Realms",
    imageUrl: starRealmsImg,
    players: "2",
    duration: "20",
    difficulty: "Medium",
    rating: 4.3,
    availability: "available",
    pricePerDay: 1.50,
  },
];

export const partyGames: GameCardProps[] = [
  {
    id: "codenames",
    title: "Codenames",
    imageUrl: codenamesImg,
    players: "2-8",
    duration: "15-30",
    difficulty: "Easy",
    rating: 4.6,
    availability: "available",
    pricePerDay: 2.50,
  },
  {
    id: "wavelength",
    title: "Wavelength",
    imageUrl: wavelengthImg,
    players: "2-12",
    duration: "30-45",
    difficulty: "Easy",
    rating: 4.5,
    availability: "available",
    pricePerDay: 3.00,
  },
  {
    id: "just-one",
    title: "Just One",
    imageUrl: justOneImg,
    players: "3-7",
    duration: "20",
    difficulty: "Easy",
    rating: 4.4,
    availability: "limited",
    pricePerDay: 2.50,
  },
  {
    id: "telestrations",
    title: "Telestrations",
    imageUrl: telestrationsImg,
    players: "4-8",
    duration: "30",
    difficulty: "Easy",
    rating: 4.3,
    availability: "available",
    pricePerDay: 2.50,
  },
  {
    id: "the-resistance",
    title: "The Resistance",
    imageUrl: theResistanceImg,
    players: "5-10",
    duration: "30",
    difficulty: "Easy",
    rating: 4.2,
    availability: "available",
    pricePerDay: 2.00,
  },
];

export const beginnerGames: GameCardProps[] = [
  {
    id: "carcassonne",
    title: "Carcassonne",
    imageUrl: carcassonneImg,
    players: "2-5",
    duration: "30-45",
    difficulty: "Easy",
    rating: 4.4,
    availability: "available",
    pricePerDay: 2.50,
  },
  {
    id: "love-letter",
    title: "Love Letter",
    imageUrl: loveLetterImg,
    players: "2-4",
    duration: "20",
    difficulty: "Easy",
    rating: 4.2,
    availability: "available",
    pricePerDay: 1.50,
  },
  {
    id: "uno",
    title: "UNO",
    imageUrl: unoImg,
    players: "2-10",
    duration: "30",
    difficulty: "Easy",
    rating: 4.0,
    availability: "available",
    pricePerDay: 1.00,
  },
  {
    id: "dobble",
    title: "Dobble",
    imageUrl: dobbleImg,
    players: "2-8",
    duration: "15",
    difficulty: "Easy",
    rating: 4.1,
    availability: "available",
    pricePerDay: 1.50,
  },
  {
    id: "exploding-kittens",
    title: "Exploding Kittens",
    imageUrl: explodingKittensImg,
    players: "2-5",
    duration: "15",
    difficulty: "Easy",
    rating: 4.0,
    availability: "limited",
    pricePerDay: 2.00,
  },
];

export const coopGames: GameCardProps[] = [
  {
    id: "pandemic",
    title: "Pandemic",
    imageUrl: pandemicImg,
    players: "2-4",
    duration: "45",
    difficulty: "Medium",
    rating: 4.5,
    availability: "available",
    pricePerDay: 3.00,
  },
  {
    id: "spirit-island",
    title: "Spirit Island",
    imageUrl: spiritIslandImg,
    players: "1-4",
    duration: "90-120",
    difficulty: "Hard",
    rating: 4.8,
    availability: "limited",
    pricePerDay: 4.50,
  },
  {
    id: "the-crew",
    title: "The Crew",
    imageUrl: theCrewImg,
    players: "2-5",
    duration: "20",
    difficulty: "Medium",
    rating: 4.6,
    availability: "available",
    pricePerDay: 2.00,
  },
  {
    id: "hanabi",
    title: "Hanabi",
    imageUrl: hanabiImg,
    players: "2-5",
    duration: "25",
    difficulty: "Medium",
    rating: 4.3,
    availability: "available",
    pricePerDay: 1.50,
  },
  {
    id: "mysterium",
    title: "Mysterium",
    imageUrl: mysteriumImg,
    players: "2-7",
    duration: "45",
    difficulty: "Medium",
    rating: 4.4,
    availability: "available",
    pricePerDay: 3.00,
  },
];

export const recommendedGames: GameCardProps[] = [
  ...strategyGames.slice(0, 2),
  ...familyGames.slice(0, 2),
  ...partyGames.slice(0, 2),
  ...coopGames.slice(0, 2),
  ...beginnerGames.slice(0, 2),
  ...twoPlayerGames.slice(0, 2),
];
