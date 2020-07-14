import React from 'react'
import {
    Typography,
    Box,
    Container,
} from '@material-ui/core'
import 'typeface-roboto'

import Logo from '../imagens/logo_muv.svg'
import { microsite, BotaoDownload } from '../components/MuiStyles'

export default function Microsite() {
    const classes = microsite()

    return (
        <>
            <Box className={classes.root}>
                <Container maxWidth="lg" className={classes.container}>
                    <Box mt={2} className={classes.filho1}>
                        <img src={Logo} width="225" alt="Logo MUV" />
                    </Box>
                    <Box mt={2} className={classes.filho2}>
                        <Typography variant="h2" gutterBottom className={classes.titulo}>
                            Demand Responsive Transport
                        </Typography>
                        <Typography variant="subtitle1">
                            Seja guiado por Viseu

                            Caso viva nas redondezas de Viseu poderá visitar a cidade por qualquer motivo,
                            só terá de se registar na aplicação disponivel para download, registar-se corretamente e
                            pedir uma viagem entre as localidades disponíveis, seja eficiente, use o DRT.
                        </Typography>
                        <Box mt={4}>
                            <BotaoDownload
                                endIcon={<i className="fal fa-download fa-lg" />}
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
