package step_definitions.Data;

/**
 * Created by Daniel on 21-Apr-17.
 */
public class ProxyBridge implements Bridge {
    private Bridge real;
    boolean userLoggedIn = false;
    public ProxyBridge() {
        real = null;
    }

    public void setRealBridge(Bridge implementation) {

    }

    @Override
    public void setUpDatabase() {

    }

    @Override
    public void logIn(String username, String password) {

    }

    @Override
    public boolean loggedIn(String username) {
        return true;
    }

    @Override
    public void logOut(String username) {

    }

    @Override
    public void register(String username, String password, String email, String firstName, String lastName, String profilePicURL) {

    }

    @Override
    public void forceLogIn(String username) {

    }

    @Override
    public boolean userExists(String username) {
        return true;
    }

    @Override
    public void deleteUser(String username) {

    }
}
