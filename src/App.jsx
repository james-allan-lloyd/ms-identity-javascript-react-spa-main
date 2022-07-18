import React, { useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { ProfileData } from "./components/ProfileData";
import { callMsGraph } from "./graph";
import Button from "react-bootstrap/Button";
import "./styles/App.css";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios from "axios";

const queryClient = new QueryClient()

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();

    console.log({accounts})

    const { isLoading, error, data: result } = useQuery(['account'], async () => {
        const adResponse = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        });
        return axios.get('https://localhost:7115/account', {
            headers: { Authorization: 'Bearer ' + adResponse.accessToken }
        })
    })

    // function RequestProfileData() {
    //     // Silently acquires an access token which is then attached to a request for MS Graph data
    //     instance.acquireTokenSilent({
    //         ...loginRequest,
    //         account: accounts[0]
    //     }).then((response) => {
    //         callMsGraph(response.accessToken).then(response => setGraphData(response));
    //     });
    // }

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <>
            <h5 className="card-title">Welcome {accounts[0].name}</h5>
            <ProfileData data={result.data}/>
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <QueryClientProvider client={queryClient}>
                    <ProfileContent />
                </QueryClientProvider>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}
