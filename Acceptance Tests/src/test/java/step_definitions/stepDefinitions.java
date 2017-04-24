package step_definitions;

import cucumber.api.PendingException;
import cucumber.api.java8.En;
import step_definitions.Data.Bridge;
import step_definitions.Data.Driver;
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
            bridge.register(username,"12345","ihopethiswontblowupatmyface@gmail.com","bob","dylan","url");
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
        System.out.println();
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


    }
}
