package step_definitions.Data;

public abstract class Driver {

    public static Bridge getBridge() {
        ProxyBridge bridge = new ProxyBridge();

        bridge.setRealBridge(null); // TODO
        return bridge;
    }
}

