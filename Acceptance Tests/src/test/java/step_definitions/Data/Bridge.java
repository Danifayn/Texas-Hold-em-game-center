package step_definitions.Data;

import java.util.Collection;

/**
 * Created by Daniel on 21-Apr-17.
 */
public interface Bridge {
    void setUpDatabase();
    
    //NOT FINISHED!!!!
    /*
    NEED TO IMPLEMENT:
        export const isUserExisting = createHandler((gc, extractor, user) => true);
        export const deleteUSer = createHandler((gc, extractor, user) => true);
        export const isGameExisting = createHandler((gc, extractor, user) => true);
        export const deleteGame = createHandler((gc, extractor, user) => true);;
        export const isUSerPlaying = createHandler((gc, extractor, user) => true);
        export const isUserSpectating = createHandler((gc, extractor, user) => true);
        export const isGameReady = createHandler((gc, extractor, user) => true);
        export const getUserCash = createHandler((gc, extractor, user) => true);
        export const getPlayerCards = createHandler((gc, extractor, user) => true);
        export const getPlayerBet = createHandler((gc, extractor, user) => true);
        export const getCurrPlayer = createHandler((gc, extractor, user) => true);
        export const getPot = createHandler((gc, extractor, user) => true);
        export const setPot = createHandler((gc, extractor, user) => true);
        export const setBigBlind = createHandler((gc, extractor, user) => true);
        export const getCallAmount = createHandler((gc, extractor, user) => true);
        export const setPlayerChips = createHandler((gc, extractor, user) => true);
        export const getLeagueCriteria = createHandler((gc, extractor, user) => true);
        export const getUserLeague = createHandler((gc, extractor, user) => true);
        export const setDefLeague = createHandler((gc, extractor, user) => true);
    */

    void logIn(String username, String password);//not using (login is done using firebase)

    boolean loggedIn(String username);//not using

    void logOut(String username);//not using

    void register(String username, String password, String email, String firstName, String lastName, String profilePicURL);//using register

    void forceLogIn(String username);//not using

    boolean userExists(String username);//using isUserExisting

    void deleteUser(String username);//using deleteUser

    void createGame(String gameName, String gameType, String buyIn, String chips, String minBet, String minPlayers, String maxPlayers, String spectatorsAllowed, String playerName);//using createGame

    boolean gameExists(String game);//using gameExists

    void deleteGame(String game);//using deleteGame

    boolean playerInGame(String playerName, String game);//using isUSerPlaying

    void addPlayerToGame(String playerName, String game);//using joinGame

    void setPlayerCash(String playerName, Integer cash);//user has cash, player has chips

    void addSpectator(String playerName, String game);//using spectate

    boolean spectatorInGame(String playerName, String game);//using isUserSpectating

    boolean gameCanStart(String gameName);//using isGameReady

    void removeUserFromGame(String userName, String gameName);//using leaveGame

    boolean isPlayerSpectatingGame(String playerName, String gameName);//same as spectatorInGame

    int gameGetPlayerCount(String gameName);//using getGamePlayerAmount

    void gameSetMinimumPlayers(String gameName, int minimumAmount);//using setMinPlayers

    void changeUserPassword(String user, String pw, String confirmPW);//using changepassword

    String getUserFirstName(String user);//user doesnt have a first name

    String getUserLastName(String user);//user doesnt have a last name

    String getUserProfilePic(String user);//not using

    void changeUserInformation(String user, String fname, String lname, String profilePic);//user has only name mail and pass

    Collection<String> listAvailableGames(String userName);//using getPlayablegameNames

    Collection<String> listAvailableSpectatableGames(String userName);//using getSpectatablegameNames

    void filterPlayerGamesByPreference(String player, String preference);//done on client side

    void filterPlayerGamesByPotSize(String player, Integer potSize);//done on client side

    void filterPlayerGamesByPlayerName(String player, String playerNameToSearch);//done on client side

    void startGame(String gameName);//using startGame

    Integer getPlayerCash(String playerName);//using getUserCash

    Collection<String> getPlayerCards(String playerName, String gameName);//using getPlayerCards

    Integer getPlayerBet(String playerName, String gameName);//using getPlayerBet

    String getCurrentPlayer(String gameName);//using getCurrPlayer

    void dealCards(String gameName);//automatic action

    String lastGameAction(String playerName, String gameName);//not saved, only per user

    int getGamePot(String gameName);//using getPot

    void setPot(String gameName, Integer pot);//using setPot

    void raise(String playerName, Integer raise, String gameName);//using doAction

    void setRoundNumber(String gameName, Integer round);//not using round number

    void setBigBlind(String gameName, Integer blind);//using setBigBlind

    void setGameType(String gameName, String gameType);//cannot change type, type is set in creation

    boolean entitledToPot(String playerName, String gameName);//happens automatically at the end of a round

    void fold(String playerName, String gameName);//using doAction

    void setPlayerRequiredBet(String playerName, String gameName, Integer chips);//using getCallAmount

    void check(String playerName, String gameName);//using doAction

    void setPlayerChipCount(String playerName, String gameName, Integer chip);//using setPlayerChips

    Integer getLeaguePromotionThreshold();//using getLeagueCriteria BUT need a league number

    void setLeaguePromotionThreshold(Integer points);//using setLeagueCriteria BUT league is a number

    String getPlayerLeague(String playerName, String league);//using getUserLeague BUT league is a number

    void changePlayerLeague(String playerName, String league);//using setUserLeague BUT league is a number

    void setDefaultLeague(String league);//using setDefLeague BUT league is a number
}
