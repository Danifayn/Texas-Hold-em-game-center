/// <reference path="../typings/globals/jasmine/index.d.ts" />
import {Player} from "./player"
import {CardStub} from "./stubs/cardStub"

describe("Player", function() {
    var player: Player;
    var cards: CardStub[];

    beforeEach(()=>{
    player = new Player(1 ,null, null);
    cards = [new CardStub(),new CardStub(),new CardStub()];
  })

  it('should allow up to 2 cards', ()=>{
    expect(
      player.dealCards(cards[0])
    ).toBe(true);

    expect(
      player.dealCards(cards[1])
    ).toBe(true);
  });

  it('should not allow more then 2 cards', ()=>{
    expect(
      player.dealCards(cards[0])
    ).toBe(true);

    expect(
      player.dealCards(cards[1])
    ).toBe(true);

    expect(
      player.dealCards(cards[2])
    ).toBe(false);
  });
});
