import React, { useState } from "react";
import {token,canisterId,createActor} from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";


function Faucet(props) {

  const[isDisable,setDisable]=useState(false);
  const[buttonText,setButton]=useState("gimme gimme");

  async function handleClick(event) {
    setDisable(true);

    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    const authenticatedCanister = createActor(canisterId,{
      agentOptions:{
        identity,
      },
    });

    const result=await authenticatedCanister.payOut();
    setButton(result);
    //setDisable(false);
    }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free DSurya tokens here! Claim 10,000 DSUR tokens to {props.userPrincipal}</label>
      <p className="trade-buttons">
        <button id="btn-payout" disabled={isDisable} onClick={handleClick}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
