declare module namespace {

    export interface ILiftsTaken {
        liftName: string;
        liftLocation: string;
        distMed: number;
        difAlt: number;
        arrAlt: number;
        startAlt: number;
        liftTime: string;
        resortLogo: string;
        liftResort: string;
        icon: string;
        liftStartTop: number;
        liftStartLeft: number;
        liftEndTop: number;
        liftEndLeft: number;
    }

    export interface ISkiDay {
        date: Date;
        avatar: string;
        userName: string;
        userSurname: string;
        userId: number;
        resortName: string;
        resortImgAvatar: string;
        mtTotRisaliti: number;
        kmTotDiscesi: number;
        hTotAttivita: number;
        toLifts: number;
        facebookUrl: string;
        liftsTaken: ILiftsTaken[];
    }
}