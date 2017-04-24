package step_definitions.Data;

import java.util.Collection;

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

    Collection<String> listAvailableGames(String userName);

    Collection<String> listAvailableSpectatableGames(String userName);

    void filterPlayerGamesByPreference(String player, String preference);

    void filterPlayerGamesByPotSize(String player, Integer potSize);

    void filterPlayerGamesByPlayerName(String player, String playerNameToSearch);

    void startGame(String gameName);

    Integer getPlayerCash(String playerName);

    Collection<String> getPlayerCards(String playerName, String gameName);

    Integer getPlayerBet(String playerName, String gameName);

    String getCurrentPlayer(String gameName);

    void dealCards(String gameName);

    String lastGameAction(String playerName, String gameName);

    int getGamePot(String gameName);

    void setPot(String gameName, Integer pot);

    void raise(String playerName, Integer raise, String gameName);

    void setRoundNumber(String gameName, Integer round);

    void setBigBlind(String gameName, Integer blind);

    void setGameType(String gameName, String gameType);

    boolean entitledToPot(String playerName, String gameName);

    void fold(String playerName, String gameName);

    void setPlayerRequiredBet(String playerName, String gameName, Integer chips);

    void check(String playerName, String gameName);

    void setPlayerChipCount(String playerName, String gameName, Integer chip);

    Integer getLeaguePromotionThreshold();

    void setLeaguePromotionThreshold(Integer points);

    String getPlayerLeague(String playerName, String league);

    void changePlayerLeague(String playerName, String league);

    void setDefaultLeague(String league);
}
