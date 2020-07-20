import React from 'react'
import {
    Typography,
    Box,
    Container,
} from '@material-ui/core'
import 'typeface-roboto'
import axios from 'axios'

import Logo from '../imagens/logo_muv.svg'
import { microsite, BotaoDownload } from '../components/MuiStyles'
import { backendUrl } from '../configs'

export default function Microsite() {
    const classes = microsite()

    const handleDownloadApp = () => {
        axios
            .get(`${backendUrl}getapk`, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'aplicacao.apk'); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
    }

    return (
        <>
            <Box className={classes.root}>
                <Container maxWidth="lg" className={classes.container}>
                    <Box pt={2}>
                        <img src={Logo} width="225" alt="Logo MUV" />
                    </Box>
                    <Box mt={2} className={classes.filho2}>
                        <Typography variant="h2" gutterBottom className={classes.titulo}>
                            Demand Responsive Transport
                        </Typography>
                        <Typography variant="subtitle1">
                            Seja guiado por Viseu.
                        </Typography>
                        <Typography variant="subtitle1">
                            Caso viva nas suas redondezas poderá visitar a cidade por qualquer motivo,
                            só terá de se registar na aplicação disponível para download, registar-se corretamente e
                            pedir uma viagem entre as localidades disponíveis, seja eficiente, use o DRT.
                        </Typography>
                        <Box mt={4}>
                            <BotaoDownload
                                endIcon={<i className="fal fa-download fa-lg" />}
                                onClick={handleDownloadApp}
                            >
                                Download App
                            </BotaoDownload>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    )
}
