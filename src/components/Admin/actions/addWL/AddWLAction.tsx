import { Flex, Button, createStyles, Text } from "@mantine/core"
import { useForm } from "@mantine/form";
import { Action } from "../../Action"
import { utils } from "ethers";
import { ContractsID, NOTIFICATIONS, NotificationsID } from "src/constants";
import { useActiveChain, useContract } from "src/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { AddWL } from "./AddWL";
import { useAtom } from "jotai";
import { wlTokensAtom } from "src/states";
import { DEFAULT_WL_TOKEN } from "src/types/WlToken";
import { IconPlus } from "@tabler/icons";
import { calcRem } from "src/utils/style";

const useStyle = createStyles((theme) => ({
    addButton: {
        '&:hover': {
            borderRadius: theme.radius.sm,
            cursor: "pointer",
            backgroundColor: theme.colors.brand
        }
    }
}));

interface AddWLForm{
    type: string;
    address: string;
}

export const AddWLAction = () => {

    const { classes } = useStyle();
 
    const realTokenYamUpgradeable = useContract(ContractsID.realTokenYamUpgradeable);
    const activeChain = useActiveChain();

    const [wlTokens,setWlTokens] = useAtom(wlTokensAtom);

    const whitelistToken = async (formValues: AddWLForm) => {
        try{

            if(!realTokenYamUpgradeable) return;
            
            const tx = await realTokenYamUpgradeable.toggleWhitelistWithType([formValues.address],[formValues.type]);

            const notificationPayload = {
                key: tx.hash,
                href: `${activeChain?.blockExplorerUrl}tx/${tx.hash}`,
                hash: tx.hash,
            };

            //TODO: add translation
            showNotification(
                NOTIFICATIONS[NotificationsID.createOfferLoading](
                notificationPayload
                )
            );

            tx
            .wait()
            .then(({ status }) => {
                updateNotification(
                    //TODO: add translation
                    NOTIFICATIONS[
                        status === 1
                            ? NotificationsID.createOfferSuccess
                            : NotificationsID.createOfferError
                    ](notificationPayload)
                );

                if(status == 1){
                    setWlTokens([DEFAULT_WL_TOKEN])
                } 
            });

        }catch(err){
            console.log("Error while adding token to WL: ", err);
        }
    }

    return(
        <Action title={"Whitelist token"}>
            <Flex direction={"column"} align={"start"}>
                <Flex mb={10} gap={"md"} pl={50}>
                    <Text style={{ width: calcRem(400)}}>{"Token type"}</Text>
                    <Text>{"Token address"}</Text>
                </Flex>
                <Flex direction={"column"} mb={0} gap={"md"}>
                    { wlTokens.map((wlToken,index) => <AddWL key={`wl-${index}`} index={index}/>)}
                    <Flex justify={"center"} className={classes.addButton} onClick={() => setWlTokens((prev) => [...prev,DEFAULT_WL_TOKEN])}><IconPlus /></Flex>
                </Flex>
                <Button type={"submit"} disabled={wlTokens.length == 0 || (wlTokens.length > 0 && wlTokens[0].address == "")}>
                    {"Whitelist token(s)"}
                </Button>
            </Flex>
        </Action>
    )
}