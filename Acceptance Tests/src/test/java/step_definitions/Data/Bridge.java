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

    void createGame(String gameName, String gameType, String buyIn, String chips, String minBet, String minPlayers, String maxPlayers, String spectatorsAllowed, String playerName);

    boolean gameExists(String game);

    void deleteGame(String game);

    boolean playerInGame(String playerName, String game);

    void addPlayerToGame(String playerName, String game);

    void setPlayerCash(String playerName, Integer cash);

    void addSpectator(String playerName, String game);

    boolean spectatorInGame(String playerName, String game);

    boolean gameCanStart(String gameName);

    void removeUserFromGame(String userName, String gameName);

    boolean isPlayerSpectatingGame(String playerName, String gameName);

    int gameGetPlayerCount(String gameName);

    void gameSetMinimumPlayers(String gameName, int minimumAmount);

    void changeUserPassword(String user, String pw, String confirmPW);

    String getUserFirstName(String user);

    String getUserLastName(String user);

    String getUserProfilePic(String user);

    void changeUserInformation(String user, String fname, String lname, String profilePic);
}
