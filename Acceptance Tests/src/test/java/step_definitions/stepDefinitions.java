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




    }
}
