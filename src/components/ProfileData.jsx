import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ProfileData = ({ data } : props) => {
    console.log(data);

    return (
        <div id="profile-div">
            <p><strong>First Name: </strong> {data.givenName}</p>
            <p><strong>Last Name: </strong> {data.surname}</p>
            <p><strong>Email: </strong> {data.userPrincipalName}</p>
            <p><strong>Id: </strong> {data.id}</p>
        </div>
    );
};