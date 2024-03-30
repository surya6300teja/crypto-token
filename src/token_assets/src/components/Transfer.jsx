import React, { useState } from "react";
import {token,canisterId,createActor} from "../../../declarations/token";
import {Principal} from '@dfinity/principal';
import { AuthClient } from "@dfinity/auth-client";

function Transfer() {
  
  const[RecipientId,setRecipient]=useState("");
  const[Amount,setAmount]=useState("");
  const[isDisable,setDisable]=useState(false);
  const[feedback,setFeedback]=useState("");
  const[isHidden,setHidden]=useState(true);

  async function handleClick() {
    setDisable(true);
    const recipient=Principal.fromText(RecipientId);
    const amount= Number(Amount);
    console.log(recipient,amount);

    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    const authenticatedCanister = createActor(canisterId,{
      agentOptions:{
        identity,
      },
    });

    const result= await authenticatedCanister.transfer(recipient,amount);
    setDisable(false);
    setFeedback(result);
    setHidden(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={RecipientId}
                onChange={(e)=>setRecipient(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={Amount}
                onChange={(e)=>setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisable}>
            Transfer
          </button>
          <p hidden={isHidden}>{feedback}</p>
        </p>
      </div>
    </div>
  );
}

export default Transfer;
