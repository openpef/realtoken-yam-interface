import { Flex, Stack, Divider, Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { OfferTypeBadge } from '../../../Offer/OfferTypeBadge/OfferTypeBadge';
import { CreatedOffer, OFFER_TYPE } from '../../../../types/offer';
import { useTranslation } from 'react-i18next';
import { Shield } from '../../../Shield/Shield';
import { WalletERC20Balance } from '../../../WalletBalance/WalletERC20Balance';
import { useWalletERC20Balance } from '../../../../hooks/useWalletERC20Balance';
import { SellFormValues } from '../CreateOfferModal';
import { useCreateOfferContext } from './CreateOfferContext';
import { PrivateOffer } from './PrivateOffer';
import { NumberInput } from '../../../NumberInput';

interface ComponentProps{
    form: UseFormReturnType<SellFormValues>;
    offer: CreatedOffer;
    tokenPrice: React.ReactNode;
    summary: React.ReactNode;
}
export const OfferModalWrapper: React.FC<ComponentProps> = ({ offer, form, tokenPrice, summary }) => {

    const { values, isValid, getInputProps, setFieldValue, errors } = form;
    const { t } = useTranslation('modals', { keyPrefix: 'createOffer' });

    const { offerTokenSymbol, shieldError, onSubmit, isLoading, isModification } = useCreateOfferContext();
    const { bigNumberbalance, balance } = useWalletERC20Balance(values.offerTokenAddress);

    return (
        <Flex direction={"column"} mx={'auto'} gap={"md"} style={{ padding: '1rem' }}>
            <Flex style={{ justifyContent: "space-between", alignItems: "center", height: "50px" }}>
                <Flex gap={"sm"} align={"center"}>
                <OfferTypeBadge offerType={offer.offerType} />
                <h3 style={{ margin: 0 }}>{ isModification ? t('common.titleFormModifyOffer') : t('common.titleFormCreateOffer')}</h3>
                </Flex>
                {offer.offerType !== OFFER_TYPE.EXCHANGE ? <Shield /> : undefined}        
            </Flex>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack justify={'center'} align={'stretch'}>
                    {tokenPrice}
                    <Divider />
                    <WalletERC20Balance balance={balance} symbol={offerTokenSymbol}/>
                    <PrivateOffer form={form} />
                    <NumberInput
                        label={offer.offerType == OFFER_TYPE.EXCHANGE ? t('common.exchangeAmount') : t('common.amount')}
                        placeholder={t('common.placeholderAmount')}
                        required={true}
                        decimalScale={6}
                        min={0.000001}
                        setFieldValue={setFieldValue}
                        showMax={false}
                        style={{ flexGrow: 1 }}
                        error={errors.amount}
                        value={getInputProps('amount').value}
                        onChange={(value) => setFieldValue('amount', value.toString())}
                    />
                    {summary}
                    <Button
                        type={'submit'}
                        aria-label={'submit'}
                        loading={(bigNumberbalance && bigNumberbalance == undefined) || isLoading}
                        disabled={!isValid() || shieldError || isLoading}
                    >
                        {isModification ? t("common.buttonUpdateOffer") : t("common.buttonCreateOffer")}
                    </Button>
                </Stack>
            </form>
        </Flex>
    );
};