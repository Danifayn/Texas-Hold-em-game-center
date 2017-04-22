package step_definitions.Data;

/**
 * Created by Daniel on 21-Apr-17.
 */
public interface Bridge {
    void setUpDatabase();

    void logIn(String username, String password);

    boolean loggedIn(String username);

    void logOut(String username);

    void register(String username, String password, String email, String firstName, String lastName, String profilePicURL);

    void forceLogIn(String username);

    boolean userExists(String username);

    void deleteUser(String username);
}
