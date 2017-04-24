package step_definitions;

import cucumber.api.PendingException;
import cucumber.api.java8.En;
import step_definitions.Data.Bridge;
import step_definitions.Data.Driver;

import java.util.Collection;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;
/**
 * Created by Daniel on 21-Apr-17.
 */

public class stepDefinitions implements En {
    public stepDefinitions() {
        Bridge bridge = Driver.getBridge();

        bridge.setUpDatabase();

        //region Log in step definitions
        Given("^\"([^\"]*)\" not logged in$", (String user) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.logOut(user);
        });
        Then("^logged in as \"([^\"]*)\"$", (String username) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(bridge.loggedIn(username));
        });
        When("^guest requests to log in with \"([^\"]*)\" and \"([^\"]*)\"$", (String username, String password) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.logIn(username,password);
        });
        Then("^log in for \"([^\"]*)\" fails$", (String username) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(!bridge.loggedIn(username));
        });
        Given("^\"([^\"]*)\" is logged in$", (String username) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.forceLogIn(username);
        });
        When("^\"([^\"]*)\" requests to log out$", (String username) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.logOut(username);
        });
        Then("^\"([^\"]*)\" is logged out$", (String username) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(!bridge.loggedIn(username));
        });
        //endregion
        //region Registration definitions
        Given("^\"([^\"]*)\" not registered$", (String username) -> {
            if(bridge.userExists(username))
                bridge.deleteUser(username);
        });
        When("^register is filled with: \"([^\"]*)\", \"([^\"]*)\", \"([^\"]*)\", \"([^\"]*)\", \"([^\"]*)\", \"([^\"]*)\"$", (String username, String password, String email, String fname, String lname, String profilePic) -> {
            bridge.register(username,password,email,fname,lname,profilePic);
        });
        Then("^registered as \"([^\"]*)\"$", (String username) -> {
            assertTrue(bridge.userExists(username));
        });
        Then("^register as \"([^\"]*)\" failed$", (String username) -> {
            assertTrue(!bridge.userExists(username));
        });
        Given("^\"([^\"]*)\" is registered$", (String username) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.register(username,"12345",(int)(Math.random()*100000)+ "@gmail.com","bob","dylan","url");
        });

        //endregion
        //region Join game definitions
        Then("^\"([^\"]*)\" is in the \"([^\"]*)\"$", (String playerName,String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(bridge.playerInGame(playerName,gameName));
        });
        When("^\"([^\"]*)\" requests to join the \"([^\"]*)\"$", (String playerName, String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.addPlayerToGame(playerName,gameName);
        });
        Given("^game is full$", () -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.register("player1","12345","mail1@gmail.com","bob","dylan","url");
            bridge.register("player2","12345","mail1@gmail.com","bob","dylan","url");
            bridge.createGame("game","limit","0","5","3","2","2","false","player1");
            bridge.addPlayerToGame("player2","game");
        });

        Then("^\"([^\"]*)\" is not in the \"([^\"]*)\"$", (String playerName, String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(!bridge.playerInGame(playerName,"game"));
        });
        Given("^\"([^\"]*)\" has (\\d+) cash$", (String playerName, Integer cash) -> {
            bridge.setPlayerCash(playerName,cash);
        });
        Given("^\"([^\"]*)\" has (\\d+) to join in the game$", (String gameName, Integer buyIn) -> {
            bridge.register("player1","12345","mail1@gmail.com","bob","dylan","url");
            bridge.createGame(gameName,"limit","" + buyIn,"5","3","2","2","false","player1");
        });
        When("^\"([^\"]*)\" requests to spectate the \"([^\"]*)\"$", (String playerName, String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.addSpectator(playerName,"game");
        });
        Then("^\"([^\"]*)\" is spectating the \"([^\"]*)\"$", (String playerName, String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(bridge.spectatorInGame(playerName,"game"));
        });
        Given("^\"([^\"]*)\" lacks one player to start$", (String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.register("player1","12345","mail1@gmail.com","bob","dylan","url");
            bridge.createGame(gameName,"limit","0","5","3","2","2","false","player1");
        });
        Then("^\"([^\"]*)\" can start$", (String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(bridge.gameCanStart(gameName));
        });
        Given("^\"([^\"]*)\" lacks two player to start$", (String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.register("player1","12345","mail1@gmail.com","bob","dylan","url");
            bridge.createGame(gameName,"limit","0","5","3","3","3","false","player1");
        });
        Then("^\"([^\"]*)\" can't start$", (String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(!bridge.gameCanStart(gameName));
        });
        //endregion
        //region Create game definitions
        When("^\"([^\"]*)\" creates \"([^\"]*)\" with \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\"$", (String playerName, String gameName, String gameType, String buyIn, String chips, String minBet, String minPlayers, String maxPlayers, String spectatorsAllowed) -> {
            bridge.createGame(gameName,gameType,buyIn,chips,minBet,minPlayers,maxPlayers,spectatorsAllowed, playerName);
        });
        Then("^\"([^\"]*)\" exists as a game$", (String game) -> {
            assertTrue(bridge.gameExists(game));
        });
        And("^\"([^\"]*)\" does not exist as a game$", (String game) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(!bridge.gameExists(game));
        });
        And("^\"([^\"]*)\" has not been created$", (String game) -> {
            bridge.deleteGame(game);
        });
        Given("^\"([^\"]*)\" has been created$", (String game) -> {
            bridge.register("player1","12345","mail1@gmail.com","bob","dylan","url");
            bridge.setPlayerCash("player1",100);
            bridge.createGame(game,"limit","10","5","10","2","10","true","player1");
        });
        //endregion
        //region Leave game definitions
        Given("^\"([^\"]*)\" plays in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.register("player1","12345","mail1@gmail.com","bob","dylan","url");
            bridge.createGame(gameName,"limit","0","5","3","2","2","false","player1");
            bridge.addPlayerToGame(playerName,gameName);
        });
        When("^\"([^\"]*)\" asks to leave \"([^\"]*)\"$", (String userName, String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.removeUserFromGame(userName,gameName);
        });
        Given("^\"([^\"]*)\" spectates in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.register("player1","12345","mail1@gmail.com","bob","dylan","url");
            bridge.createGame(gameName,"limit","0","5","3","2","2","false","player1");
            bridge.addSpectator(playerName,gameName);
        });
        Then("^\"([^\"]*)\" is not spectating in the \"([^\"]*)\"$", (String playerName, String gameName) -> {
            assertTrue(bridge.isPlayerSpectatingGame(playerName,gameName));
        });
        Given("^\"([^\"]*)\" is waiting for \"([^\"]*)\" to start$", (String playerName, String gameName) -> {
            bridge.register("player1","12345","mail1@gmail.com","bob","dylan","url");
            bridge.createGame(gameName,"limit","0","5","3","2","2","false","player1");
            bridge.addPlayerToGame(playerName,gameName);
        });
        And("^\"([^\"]*)\" has minimum players$", (String gameName) -> {
            bridge.gameSetMinimumPlayers(gameName,bridge.gameGetPlayerCount(gameName));
        });
        //endregion
        //region Edit User Profile definitions
        When("^\"([^\"]*)\" asks to change password and fills pw with \"([^\"]*)\" and confirmation with \"([^\"]*)\"$", (String user, String pw, String confirmPW) -> {
            bridge.changeUserPassword(user,pw,confirmPW);
        });
        Then("^\"([^\"]*)\" password is \"([^\"]*)\"$", (String userName, String pw) -> {
            if(bridge.loggedIn(userName))
                bridge.logOut(userName);
            bridge.logIn(userName,pw);
            assertTrue(bridge.loggedIn(userName));
        });
        When("^\"([^\"]*)\" asks to change fName to \"([^\"]*)\", lName to \"([^\"]*)\", profile pic to \"([^\"]*)\"$", (String user, String fname, String lname, String profilePic) -> {
            bridge.changeUserInformation(user,fname,lname,profilePic);
        });
        Then("^\"([^\"]*)\" fName is \"([^\"]*)\", lName is \"([^\"]*)\", profile pic is \"([^\"]*)\"$", (String user, String fname, String lname, String profilePic) -> {
            boolean infoChanged = true;
            infoChanged &= bridge.getUserFirstName(user).equals(fname);
            infoChanged &= bridge.getUserLastName(user).equals(lname);
            infoChanged &= bridge.getUserProfilePic(user).equals(profilePic);
            assertTrue(infoChanged);
        });
        //endregion
        //region List all active games
        And("^\"([^\"]*)\" has maximum players$", (String gameName) -> {
            bridge.register("player1","12345","mail1@gmail.com","bob","dylan","url");
            bridge.setPlayerCash("player1",100);
            bridge.register("player2","12345","mail1@gmail.com","bob","dylan","url");
            bridge.setPlayerCash("player1",100);
            bridge.createGame(gameName,"limit","10","5","10","2","2","true","player1");
            bridge.addPlayerToGame("player2",gameName);
        });
        Then("^only \"([^\"]*)\" is in the available games list for \"([^\"]*)\"$", (String gameName, String userName) -> {
            Collection<String> c = bridge.listAvailableGames(userName);
            assertTrue(c.contains(gameName) && c.size()==1);
        });
        Then("^only \"([^\"]*)\" is in the available spectatable games list for \"([^\"]*)\"$", (String gameName, String userName) -> {
            Collection<String> c = bridge.listAvailableSpectatableGames(userName);
            assertTrue(c.contains(gameName) && c.size()==1);
        });
        //endregion
        //region Filter active games
        When("^\"([^\"]*)\" filters by preference \"([^\"]*)\"$", (String player, String preference) -> {
            bridge.filterPlayerGamesByPreference(player,preference);
        });
        When("^\"([^\"]*)\" filters by pot size (\\d+)$", (String player, Integer potSize) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.filterPlayerGamesByPotSize(player,potSize);
        });
        When("^\"([^\"]*)\" filters by player name \"([^\"]*)\"$", (String player, String playerNameToSearch) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.filterPlayerGamesByPlayerName(player,playerNameToSearch);
        });
        //endregion
        //region Start game
        And("^\"([^\"]*)\" is in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            bridge.addPlayerToGame(playerName,gameName);
        });
        When("^\"([^\"]*)\" starts$", (String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.startGame(gameName);
        });
        Then("^\"([^\"]*)\" has (\\d+) cash left$", (String playerName, Integer cash) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(bridge.getPlayerCash(playerName)==cash);
        });
        And("^\"([^\"]*)\" has (\\d+) cards in \"([^\"]*)\"$", (String playerName, Integer cardCount, String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            assertTrue(bridge.getPlayerCards(playerName, gameName).size()==cardCount);
        });
        And("^\"([^\"]*)\" has (\\d+) betted in \"([^\"]*)\"$", (String playerName, Integer betAmount, String gameName) -> {
            assertTrue(bridge.getPlayerBet(playerName,gameName)==betAmount);
        });
        And("^it is \"([^\"]*)\" turn in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            assertTrue(bridge.getCurrentPlayer(gameName).equals(playerName));
        });
        //endregion =
        //region Deal cards
        When("^cards are dealt in \"([^\"]*)\"$", (String gameName) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.dealCards(gameName);
        });
        //endregion
        //region Game Actions
        Given("^\"([^\"]*)\" has (\\d+) chips in \"([^\"]*)\"$", (String playerName, Integer chip, String gameName) -> {
            bridge.setPlayerChipCount(playerName,gameName,chip);
        });
        And("^\"([^\"]*)\" can check in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            bridge.setPlayerRequiredBet(playerName,gameName,0);
        });
        When("^\"([^\"]*)\" checks in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            bridge.check(playerName,gameName);
        });
        Then("^\"([^\"]*)\" checked in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            assertTrue(bridge.lastGameAction(playerName,gameName) == "check");
        });
        And("^\"([^\"]*)\" needs to add (\\d+) chips to call in \"([^\"]*)\"$", (String playerName, Integer chips, String gameName) -> {
            bridge.setPlayerRequiredBet(playerName,gameName,chips);
        });
        Then("^\"([^\"]*)\" has not checked in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            assertTrue(bridge.lastGameAction(playerName,gameName) != "check");
        });
        When("^\"([^\"]*)\" folds in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            bridge.fold(playerName,gameName);
        });
        Then("^\"([^\"]*)\" not participating in pot in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            assertTrue(!bridge.entitledToPot(playerName,gameName));
        });
        Given("^\"([^\"]*)\" type is \"([^\"]*)\"$", (String gameName, String gameType) -> {
            bridge.setGameType(gameName,gameType);
        });
        And("^big blind is (\\d+) in \"([^\"]*)\"$", (Integer blind, String gameName) -> {
            bridge.setBigBlind(gameName,blind);
        });
        And("^round number is (\\d+) in \"([^\"]*)\"$", (Integer round, String gameName) -> {
            bridge.setRoundNumber(gameName,round);
        });
        When("^\"([^\"]*)\" raises (\\d+) in \"([^\"]*)\"$", (String playerName, Integer raise, String gameName) -> {
            bridge.raise(playerName,raise,gameName);
        });
        And("^\"([^\"]*)\" pot is (\\d+)$", (String gameName, Integer pot) -> {
            bridge.setPot(gameName,pot);
        });
        Then("^\"([^\"]*)\" raised (\\d+) in \"([^\"]*)\"$", (String playerName, Integer raise, String gameName) -> {
            assertTrue(bridge.lastGameAction(playerName,gameName) == "raise");
        });
        And("^pot size increased by (\\d+) in \"([^\"]*)\" from (\\d+)$", (Integer potIncrease, String gameName, Integer potSize) -> {
            assertTrue(bridge.getGamePot(gameName) == potIncrease + potSize);
        });
        Then("^\"([^\"]*)\" has not raised in \"([^\"]*)\"$", (String playerName, String gameName) -> {
            assertTrue(bridge.lastGameAction(playerName,gameName) != "raise");
        });
        //endregion
        //region League Actions
        Given("^default league is \"([^\"]*)\"$", (String league) -> {
            // Write code here that turns the phrase above into concrete actions
            bridge.setDefaultLeague(league);
        });
        And("^league moving threshold is (\\d+) points$", (Integer points) -> {
            bridge.setLeaguePromotionThreshold(points);
        });
        When("^\"([^\"]*)\" is moved to \"([^\"]*)\"$", (String playerName, String league) -> {
            bridge.changePlayerLeague(playerName,league);
        });
        Then("^\"([^\"]*)\" is in league \"([^\"]*)\"$", (String playerName, String league) -> {
            assertTrue(bridge.getPlayerLeague(playerName,league).equals(league));
        });
        When("^league moving threshold is changed to (\\d+)$", (Integer points) -> {
            bridge.setLeaguePromotionThreshold(points);
        });
        Then("^league moving threshold is now (\\d+)$", (Integer points) -> {
            assertTrue(bridge.getLeaguePromotionThreshold() == points);
        });
        //endregion

    }
}
