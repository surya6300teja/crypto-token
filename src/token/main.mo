import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";


actor Token {
    

    let owner : Principal = Principal.fromText("sm4x6-wnvgc-x4org-jniof-jfmnj-o7te7-6i2yd-5uubz-r27bn-oprll-yqe");
    let totalSupply : Nat = 1000000000;
    let symbol : Text = "DSUR";

    private stable var balanceEntries: [(Principal,Nat)] =[];
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    if(balances.size() < 1){
            balances.put(owner, totalSupply);
        };
    

    public query func balanceOf(who : Principal) : async Nat {
        let balance : Nat = switch (balances.get(who)) {
            case null 0;
            case (?int) int;
        };

        return balance;
    };

    public query func getSymbol() : async Text {
        return symbol;
    };

    public shared(msg) func payOut() : async Text {
        // Debug.print(debug_show(msg.caller));
        if (balances.get(msg.caller) == null) {
            let amount = 10000;
            let result = await transfer(msg.caller, amount);
            return result;
        } else {
            return "already claimed";
        };
    };

    public shared(msg) func transfer(to : Principal, amount : Nat) : async Text {
        let fromBalance = await balanceOf(msg.caller);
        Debug.print(debug_show(fromBalance));
        if (fromBalance >= amount) {
            let newfromBalance : Nat = fromBalance - amount;
            balances.put(msg.caller, newfromBalance);

            let toBalance = await balanceOf(to);
            let newtoBalance = toBalance + amount;
            balances.put(to, newtoBalance);

            return "successful";
        } else {
            return "Insufficient tokens";
        };
    };

    system func preupgrade(){
        balanceEntries := Iter.toArray(balances.entries());
    };

    system func postupgrade(){
        balances := HashMap.fromIter<Principal,Nat>(balanceEntries.vals(),1,Principal.equal,Principal.hash);
        if(balances.size() < 1){
            balances.put(owner, totalSupply);
        };
        
    };
}
