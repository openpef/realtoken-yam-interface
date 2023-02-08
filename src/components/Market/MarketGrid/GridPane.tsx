import { createStyles, Flex, Skeleton, Text } from "@mantine/core"
import { FC, useMemo } from "react"
import { useTranslation } from "react-i18next";
import { OfferPrice } from "src/components/Column/OfferPrice";
import { OfferYield } from "src/components/Column/OfferYield";
import { OffialPrice } from "src/components/Column/OfficialPrice";
import { OriginalYield } from "src/components/Column/OriginalYield";
import { OfferTypeBadge } from "src/components/Offer/OfferTypeBadge";
import { usePropertiesToken } from "src/hooks/usePropertiesToken";
import { OFFER_TYPE } from "src/types/offer";
import { Offer } from "src/types/offer/Offer"
import { calcRem } from "src/utils/style";
import { BuyActionsWithPermit } from "../BuyActions";
import { ShowOfferAction } from "../ShowOfferAction/ShowOfferAction";

const useStyle = createStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "#624105",
        borderRadius: theme.radius.md,
        overflow: "hidden",
        height: "100%",
    },
    header: {
        backgroundColor: "#624105",
        padding: theme.spacing.sm
    },
    content: {
        height: "100%",
    },
    data: {
        flexGrow: 1
    },
    offerTokenName: {
        color: "white",
        fontSize: theme.fontSizes.lg,
        fontWeight: 700
    },
    buyerTokenName: {
        fontStyle: 'italic',
        fontWeight: 500,
        color: theme.colors.gray[5]
    },
    buyButtonGroup: {
        width: "50%",
    },
    buyButton: {
        width: "100%",
        height: "35px"
    },
    showOfferButton: {
        width: "50%",
        height: "35px"
    },
    loader: {
        height: "500px",
        width: "500px"
    }, 
    offerId:{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${theme.spacing.sm}px`,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.dark,
        fontSize: theme.fontSizes.lg,
        fontWeight: 700,
        color: "white"
    },
    table: {
        width: "100%",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.colors.brand,
        borderRadius: theme.radius.md,
        overflow: "hidden",
        padding: 0,
        borderSpacing: 0
    },
    tableHead: {
        backgroundColor: theme.colors.brand,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.colors.brand,
    },
    tableCell: {
        padding: calcRem(5),
        textAlign: "center",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.colors.brand,
    }   
}));

interface GridPaneProps{
    offer: Offer
}
export const GridPane: FC<GridPaneProps> = ({ offer }) => {

    const { t } = useTranslation('buy', { keyPrefix: 'table' });
    const { classes } = useStyle();

    return(
        <>
        {
            !offer.availableAmount ?
                <Skeleton height={300} width={430}/>
            :
            <Flex className={classes.container}>
                <Flex direction={"column"} align={"start"} color={"brand"} className={classes.header} >
                    <Flex gap={"sm"}>
                        <Flex className={classes.offerId} mb={10}>{offer.offerId}</Flex>
                        <OfferTypeBadge offerType={offer.type ?? OFFER_TYPE.SELL}/>
                    </Flex>
                
                    <Text className={classes.offerTokenName}>{offer.offerTokenName}</Text>
                    <Text className={classes.buyerTokenName}>{offer.buyerTokenName}</Text>
                </Flex>
                <Flex direction={"column"} p={"sm"} gap={"sm"} className={classes.content}>
                    <Flex direction={"column"} mb={10} className={classes.data}>
                        <Flex direction={"column"}>
                            <Text fw={700}>{t("sellerAddress")}</Text>
                            {offer.sellerAddress}
                        </Flex>
                        <Flex direction={"column"}>
                            <Text fw={700}>{t("amount")}</Text>
                            {offer.amount}
                        </Flex>
                        <Flex direction={"column"} mb={15}>
                            <Text fw={700}>{t("price")}</Text>
                            {offer.price}
                        </Flex>
                        <Flex>
                            <table className={classes.table}>
                                <thead className={classes.tableHead}>
                                    <tr>
                                        <th className={classes.tableCell}></th>
                                        <th className={classes.tableCell}>Original</th>
                                        <th className={classes.tableCell}>Offer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className={classes.tableCell}>Yield</td>
                                        <td className={classes.tableCell}><OriginalYield offer={offer}/></td>
                                        <td className={classes.tableCell}><OfferYield offer={offer}/></td>
                                    </tr>
                                    <tr>
                                        <td className={classes.tableCell}>Price</td>
                                        <td className={classes.tableCell}><OffialPrice offer={offer}/></td>
                                        <td className={classes.tableCell}><OfferPrice offer={offer}/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </Flex>
                    </Flex>
                    <Flex gap={"sm"}>
                        <BuyActionsWithPermit
                            buyOffer={offer}
                            groupClassName={classes.buyButtonGroup}
                            buttonClassName={classes.buyButton}
                        />
                        <ShowOfferAction 
                            offer={offer}
                            className={classes.showOfferButton}
                        />
                    </Flex>
                </Flex>
            </Flex>
        }
        </>
    )
}