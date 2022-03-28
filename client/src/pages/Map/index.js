import React, { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import GoogleMapReact from "google-map-react";
// import useSupercluster from "use-supercluster";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";

import "./styles.css";
import aNegativeLogo from "../../images/a_negat.svg";
import aPositiveLogo from "../../images/a_posit.svg";
import abNegativeLogo from "../../images/ab_negat.svg";
import abPositiveLogo from "../../images/ab_posit.svg";
import bNegativeLogo from "../../images/b_negat.svg";
import bPositiveLogo from "../../images/b_posit.svg";
import oNegativeLogo from "../../images/o_negat.svg";
import oPositiveLogo from "../../images/o_posit.svg";

//Clusterizar com o zoom
//Filtro de tipos sanguineos
//Fazer campo endereco opcional - OK

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    formControl: {
        // margin: theme.spacing(3)
    }
}));

const Marker = ({ children }) => children;

export default function Map() {
    const [mapsData, setMapsData] = useState({
        center: {
            lat: -23.5523312,
            lng: -46.6562576
        },
        zoom: 13.6
    });

    const [donors, setDonors] = useState([]);

    const [aPositive, setAPositive] = useState(true);
    const [aNegative, setANegative] = useState(true);
    const [bPositive, setBPositive] = useState(true);
    const [bNegative, setBNegative] = useState(true);
    const [abPositive, setAbPositive] = useState(true);
    const [abNegative, setAbNegative] = useState(true);
    const [oPositive, setOPositive] = useState(true);
    const [oNegative, setONegative] = useState(true);

    // const []

    // const mapRef = useRef();
    // const [zoom, setZoom] = useState(10);
    // const [bounds, setBounds] = useState(null);
    // const points = donors.map(donor => ({
    //     type: "Feature",
    //     properties: {
    //         cluster: false,
    //         donorId:
    //     }
    // }))

    // const { clusters } = useSupercluster({
    //     points,
    //     bounds,
    //     zoom,
    //     options: {
    //         radius: 75,
    //         maxZoom: 20
    //     }
    // });

    useEffect(() => {
        async function getDonors() {
            const { data } = await api.get("/getDonors");

            console.log(data);
            setDonors(data);
        }

        getDonors();
    }, []);

    function getImageByBloodType(bloodType) {
        if (bloodType === "A+" && aPositive) {
            return aPositiveLogo;
        } else if (bloodType === "A-") {
            return aNegativeLogo;
        } else if (bloodType === "B+") {
            return bPositiveLogo;
        } else if (bloodType === "B-") {
            return bNegativeLogo;
        } else if (bloodType === "AB+") {
            return abPositiveLogo;
        } else if (bloodType === "AB-") {
            return abNegativeLogo;
        } else if (bloodType === "O+") {
            return oPositiveLogo;
        } else if (bloodType === "O-") {
            return oNegativeLogo;
        }
    }

    function getFilter(bloodType) {
        if (
            (bloodType === "A+" && aPositive) ||
            (bloodType === "A-" && aNegative) ||
            (bloodType === "B+" && bPositive) ||
            (bloodType === "B-" && bNegative) ||
            (bloodType === "AB+" && abPositive) ||
            (bloodType === "AB-" && abNegative) ||
            (bloodType === "O+" && oPositive) ||
            (bloodType === "O-" && oNegative)
        ) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <>
            <div style={{ height: "100vh", width: "100%" }}>
                <div className="filterContainer">
                    <p>Filtrar por Tipo Sanguíneo</p>
                    <div className="checkContainer">
                        <FormControl
                            component="fieldset"
                            className="formControl"
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={aPositive}
                                            onChange={e =>
                                                setAPositive(e.target.checked)
                                            }
                                            name="A+"
                                        />
                                    }
                                    label="A+"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={aNegative}
                                            onChange={e =>
                                                setANegative(e.target.checked)
                                            }
                                            name="A-"
                                        />
                                    }
                                    label="A-"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={bPositive}
                                            onChange={e =>
                                                setBPositive(e.target.checked)
                                            }
                                            name="B+"
                                        />
                                    }
                                    label="B+"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={bNegative}
                                            onChange={e =>
                                                setBNegative(e.target.checked)
                                            }
                                            name="B-"
                                        />
                                    }
                                    label="B-"
                                />
                            </FormGroup>
                            {/* <FormHelperText>Be careful</FormHelperText> */}
                        </FormControl>
                        <FormControl
                            component="fieldset"
                            className="formControl"
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={abPositive}
                                            onChange={e =>
                                                setAbPositive(e.target.checked)
                                            }
                                            name="AB+"
                                        />
                                    }
                                    label="AB+"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={abNegative}
                                            onChange={e =>
                                                setAbNegative(e.target.checked)
                                            }
                                            name="AB-"
                                        />
                                    }
                                    label="AB-"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={oPositive}
                                            onChange={e =>
                                                setOPositive(e.target.checked)
                                            }
                                            name="O+"
                                        />
                                    }
                                    label="O+"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={oNegative}
                                            onChange={e =>
                                                setONegative(e.target.checked)
                                            }
                                            name="O-"
                                        />
                                    }
                                    label="O-"
                                />
                            </FormGroup>
                            {/* <FormHelperText>Be careful</FormHelperText> */}
                        </FormControl>
                    </div>
                </div>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "AIzaSyCfCUDIMiDeHP6B-g-WNnA3wneY9IwcCIw"
                    }}
                    defaultCenter={mapsData.center}
                    defaultZoom={mapsData.zoom}
                >
                    {donors
                        .filter(donor => getFilter(donor.tipoSanguineo))
                        .map(donor => (
                            <Marker
                                key={donor._id}
                                lat={donor.location.coordinates[1]}
                                lng={donor.location.coordinates[0]}
                            >
                                <img
                                    src={getImageByBloodType(
                                        donor.tipoSanguineo
                                    )}
                                    height="45"
                                    width="40"
                                    alt=""
                                />
                            </Marker>
                        ))}
                    {/* {donors.map(donor => (
                        <Marker
                            key={donor.id}
                            lat={donor.location.coordinates[1]}
                            lng={donor.location.coordinates[0]}
                        >
                            <img
                                src={getImageByBloodType(donor.tipoSanguineo)}
                                height="45"
                                width="40"
                                alt=""
                            />
                        </Marker>
                    ))} */}
                </GoogleMapReact>
            </div>
        </>
    );
}
