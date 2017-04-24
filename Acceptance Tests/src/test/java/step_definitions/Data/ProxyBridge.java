package step_definitions.Data;

import java.util.Collection;

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

    @Override
    public Collection<String> listAvailableGames(String userName) {
        return null;
    }

    @Override
    public Collection<String> listAvailableSpectatableGames(String userName) {
        return null;
    }

    @Override
    public void filterPlayerGamesByPreference(String player, String preference) {

    }

    @Override
    public void filterPlayerGamesByPotSize(String player, Integer potSize) {

    }

    @Override
    public void filterPlayerGamesByPlayerName(String player, String playerNameToSearch) {

    }

    @Override
    public void startGame(String gameName) {

    }

    @Override
    public Integer getPlayerCash(String playerName) {
        return null;
    }

    @Override
    public Collection<String> getPlayerCards(String playerName, String gameName) {
        return null;
    }

    @Override
    public Integer getPlayerBet(String playerName, String gameName) {
        return null;
    }

    @Override
    public String getCurrentPlayer(String gameName) {
        return null;
    }

    @Override
    public void dealCards(String gameName) {

    }

    @Override
    public String lastGameAction(String playerName, String gameName) {
        return null;
    }

    @Override
    public int getGamePot(String gameName) {
        return 0;
    }

    @Override
    public void setPot(String gameName, Integer pot) {

    }

    @Override
    public void raise(String playerName, Integer raise, String gameName) {

    }

    @Override
    public void setRoundNumber(String gameName, Integer round) {

    }

    @Override
    public void setBigBlind(String gameName, Integer blind) {

    }

    @Override
    public void setGameType(String gameName, String gameType) {

    }

    @Override
    public boolean entitledToPot(String playerName, String gameName) {
        return false;
    }

    @Override
    public void fold(String playerName, String gameName) {

    }

    @Override
    public void setPlayerRequiredBet(String playerName, String gameName, Integer chips) {

    }

    @Override
    public void check(String playerName, String gameName) {

    }

    @Override
    public void setPlayerChipCount(String playerName, String gameName, Integer chip) {

    }

    @Override
    public Integer getLeaguePromotionThreshold() {
        return null;
    }

    @Override
    public void setLeaguePromotionThreshold(Integer points) {

    }

    @Override
    public String getPlayerLeague(String playerName, String league) {
        return null;
    }

    @Override
    public void changePlayerLeague(String playerName, String league) {

    }

    @Override
    public void setDefaultLeague(String league) {

    }
}
