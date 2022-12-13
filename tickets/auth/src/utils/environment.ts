type EnvironmentVariables = {
    jwt: {
        JWT_KEY: string;
    }
};

const asString = (reference: any) => {
    if(reference == undefined) {
        throw new Error( Object.keys(reference)[0] + ' is undefined');
    }

    return reference;
}

export const environment: EnvironmentVariables = {
    jwt: {
        JWT_KEY: asString(process.env.JWT_KEY),
    }
};