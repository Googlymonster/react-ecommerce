import React, {useState,useEffect} from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom'
import { commerce } from '../../lib/commerce'

import FormInput from './CustomTextField'

const AddressForm = ({checkoutToken, next}) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const [liveObject, setLiveObject] = useState({});
    const methods = useForm();

    const fetchShippingCountries = async (checkoutTokenId) => {
        try {
            const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);
            setShippingCountries(countries);
            setShippingCountry(Object.keys(countries)[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSubdivisions = async (countryCode) => {
        try {
            const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);
            setShippingSubdivisions(subdivisions);
            setShippingSubdivision(Object.keys(subdivisions)[0]);
        } catch (error) {
            console.log(error);
        }

    };

    const fetchShippingOptions = async (checkoutTokenId, country, stateProvince) => {
        try {
            const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country: country, region: stateProvince });
            console.log(options);
            setShippingOptions(options);
            setShippingOption(options[0]?.id || '');
            // validateShippingOption(checkoutTokenId, options[0]?.id, shippingCountry, shippingSubdivision);
        } catch (error) {
            console.log(error);
        }
      };

    // const validateShippingOption = async (checkoutTokenid, shippingOptionId, country, region = null) => {
    //     try {
    //         const valid = await commerce.checkout.checkShippingOption(checkoutTokenid, {shipping_option_id: shippingOptionId, country: country, region: region});
    //         console.log(valid);
    //         setShippingOption(valid);
    //         getLiveObject();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const getLiveObject = async (checkoutTokenId) => {
    //     try {
    //         const response = await commerce.checkout.getLive(checkoutTokenId);
    //         // console.log(response);
    //         setLiveObject(response);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
        // getLiveObject(checkoutToken.id);

    }, [])

    useEffect(() => {
        if(shippingCountry) fetchSubdivisions(shippingCountry);
    }, [shippingCountry])

    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
        console.log(shippingCountry);
        console.log(shippingSubdivision);
        console.log(shippingOption);
      }, [shippingSubdivision]);

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountry, shippingSubdivision, shippingOption}))}>
                    <Grid container spacing={3}>
                        <FormInput name='firstName' label='First Name'/>
                        <FormInput name="lastName" label="Last name" />
                        <FormInput name="address1" label="Address line 1" />
                        <FormInput name="email" label="Email" />
                        <FormInput name="city" label="City" />
                        <FormInput name="zip" label="Zip / Postal code" />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e)=> setShippingCountry(e.target.value)}>
                                {Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name})).map((country) => (
                                <MenuItem key={country.id} value={country.id}>
                                    {country.label}
                                </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                                {Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name})).map((subdivision) => (
                                <MenuItem key={subdivision.id} value={subdivision.id}>
                                    {subdivision.label}
                                </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((so, index) => (
                                <MenuItem key={index} value={so.id || ""}>
                                    {so.label}
                                </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br/>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};

export default AddressForm;
