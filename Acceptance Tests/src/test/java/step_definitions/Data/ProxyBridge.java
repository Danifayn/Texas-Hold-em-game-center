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

    @Override
    public void createGame(String gameName, String gameType, String buyIn, String chips, String minBet, String minPlayers, String maxPlayers, String spectatorsAllowed, String playerName) {

    }

    @Override
    public boolean gameExists(String game) {
        return true;
    }

    @Override
    public void deleteGame(String game) {

    }

    @Override
    public boolean playerInGame(String playerName, String game) {
        return false;
    }

    @Override
    public void addPlayerToGame(String playerName, String game) {

    }

    @Override
    public void setPlayerCash(String playerName, Integer cash) {

    }

    @Override
    public void addSpectator(String playerName, String game) {

    }

    @Override
    public boolean spectatorInGame(String playerName, String game) {
        return false;
    }

    @Override
    public boolean gameCanStart(String gameName) {
        return false;
    }

    @Override
    public void removeUserFromGame(String userName, String gameName) {

    }

    @Override
    public boolean isPlayerSpectatingGame(String playerName, String gameName) {
        return false;
    }

    @Override
    public int gameGetPlayerCount(String gameName) {
        return 0;
    }

    @Override
    public void gameSetMinimumPlayers(String gameName, int minimumAmount) {

    }

    @Override
    public void changeUserPassword(String user, String pw, String confirmPW) {

    }

    @Override
    public String getUserFirstName(String user) {
        return null;
    }

    @Override
    public String getUserLastName(String user) {
        return null;
    }

    @Override
    public String getUserProfilePic(String user) {
        return null;
    }

    @Override
    public void changeUserInformation(String user, String fname, String lname, String profilePic) {

    }
}
