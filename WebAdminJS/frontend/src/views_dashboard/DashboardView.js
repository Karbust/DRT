import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import {
    Typography, Box, Grid,
    Card, CardContent, CardMedia,
    TextField,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ReactApexChart from 'react-apexcharts'
import { amber } from '@material-ui/core/colors'
import moment from 'moment'

import { useStyles } from '../components/MuiStyles'
import { PaginasHeader } from '../components/PaginasHeader'
import { getUrl } from '../components/functions'
import { traducao } from '../traducao_apexcharts'

export default function DashboardView() {
    const classes = useStyles()

    const [message, setMessage] = useState('')
    const [severidade, setSeveridade] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [contador, setContador] = useState({})
    const [localidades, setLocalidades] = useState({})
    const [localidade, setLocalidade] = useState(9)
    const [motoristas, setMotoristas] = useState({})
    //const [motorista, setMotorista] = useState(7)
    const [motorista, setMotorista] = useState(2)
    const [top10localidades, setTop10localidades] = useState({
        options: {},
        series: [],
    })
    const [passageiros, setPassageiros] = useState({
        options: {},
        series: [],
    })
    const [origemDestinoDia, setOrigemDestinoDia] = useState({
        options: {},
        series: [],
    })
    const [viagensMotoristaMes, setViagensMotoristaMes] = useState({
        options: {},
        series: [],
    })
    const [loading, setLoading] = useState(true)
    const [loadingOrigemDestinoDia, setLoadingOrigemDestinoDia] = useState(false)
    const [loadingViagensMotoristaMes, setLoadingViagensMotoristaMes] = useState(false)
    const firstUpdateLocalidade = useRef(true)
    const firstUpdateMotorista = useRef(true)

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false)
    }
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlert(false)
    }

    const handleGraficoTop10Localidades = (data) => {
        setTop10localidades({
            options: {
                chart: {
                    locales: traducao,
                    defaultLocale: 'pt',
                    redrawOnParentResize: true,
                    toolbar: {
                        show: false,
                    },
                },
                theme: {
                    monochrome: {
                        enabled: true,
                        color: amber['600'],
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    categories: data.top10localidades.map((row) => row.LOCALIDADE),
                },
                responsive: [{
                    breakpoint: 1280,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '25px',
                            },
                        },
                    },
                }],
            },
            series: [{
                name: '# Viagens',
                data: data.top10localidades.map((count) => count.count),
            }],
        })
    }
    const handleGraficoOrigemDestinoDia = (data, localidadesObj) => {
        const arrayDataOrigem = data.origemDia.map((date) => date.datas)
        const arrayDataDestino = data.destinoDia.map((date) => date.datas)
        const arrayCountOrigem = data.origemDia.map((count) => count.count)
        const arrayCountDestino = data.destinoDia.map((count) => count.count)

        const array3 = [...arrayDataOrigem, ...arrayDataDestino].sort((a, b) => {
            return new Date(a) - new Date(b)
        })

        Object.keys(arrayCountOrigem).forEach((key) => {
            if (arrayCountOrigem[key] === null) {
                arrayCountOrigem[key] = 0
            }
        })

        Object.keys(arrayCountDestino).forEach((key) => {
            if (arrayCountDestino[key] === null) {
                arrayCountDestino[key] = 0
            }
        })

        const array4 = [...new Set(array3)]

        setOrigemDestinoDia({
            options: {
                chart: {
                    locales: traducao,
                    defaultLocale: 'pt',
                    redrawOnParentResize: true,
                    zoom: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false,
                    },
                },
                title: {
                    text: `Localidade: ${localidadesObj.find((x) => x.NR_LOCALIDADE === localidade).LOCALIDADE}`,
                    align: 'left',
                },
                colors: [amber['400'], amber['800']],
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    categories: array4,
                    labels: {
                        formatter(value) {
                            return moment(value).format('DD MMM')
                        },
                    },
                },
                yaxis: {
                    axisBorder: {
                        show: true,
                    },
                    labels: {
                        offsetX: 0,
                        formatter(val) {
                            return Number(val).toFixed(0)
                        },
                    },
                },
                noData: {
                    text: 'Não há dados suficientes.',
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '14px',
                        fontFamily: undefined,
                    },
                },
                legend: {
                    tooltipHoverFormatter(val, opts) {
                        return `${val} - ${opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]}`
                    },
                },
                responsive: [{
                    breakpoint: 1280,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '25px',
                            },
                        },
                    },
                }],
            },
            series: [{
                name: '# Origem',
                data: arrayCountOrigem,
            }, {
                name: '# Destino',
                data: arrayCountDestino,
            }],
        })
    }
    const handleGraficoPassageiros = (data) => {
        const arrayPassageiros = data.passageiros.map((row) => row.passageiros)
        const arrayPassageirosCount = data.passageiros.map((count) => count.count)

        Object.keys(arrayPassageirosCount).forEach((key) => {
            if (arrayPassageirosCount[key] === null) {
                arrayPassageirosCount[key] = 0
            }
        })

        setPassageiros({
            options: {
                chart: {
                    height: 350,
                    type: 'radar',
                    redrawOnParentResize: true,
                    toolbar: {
                        show: false,
                    },
                },
                colors: [amber['600']],
                dataLabels: {
                    enabled: true,
                    background: {
                        enabled: true,
                        borderRadius: 2,
                    },
                },
                xaxis: {
                    categories: arrayPassageiros,
                },
            },
            series: [{
                name: '# Passageiros',
                data: arrayPassageirosCount,
            }],
        })
    }
    const handleGraficoViagensMotoristaMes = (data, motoristasObj) => {
        const arrayDatas = data.map((row) => row.datas)
        const arrayCount = data.map((count) => count.count)

        Object.keys(arrayCount).forEach((key) => {
            if (arrayCount[key] === null) {
                arrayCount[key] = 0
            }
        })

        console.log(motoristasObj)

        setViagensMotoristaMes({
            options: {
                chart: {
                    locales: traducao,
                    defaultLocale: 'pt',
                    redrawOnParentResize: true,
                    zoom: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false,
                    },
                },
                title: {
                    text: `Motorista: ${motoristasObj.find((x) => x.NR_UTILIZADOR === motorista).NOME_UTILIZADOR}`,
                    align: 'left',
                },
                colors: [amber['600']],
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    categories: arrayDatas,
                    labels: {
                        formatter(value) {
                            return moment(value).format('MMM YY')
                        },
                    },
                },
                yaxis: {
                    axisBorder: {
                        show: true,
                    },
                    labels: {
                        offsetX: 0,
                        formatter(val) {
                            return Number(val).toFixed(0)
                        },
                    },
                },
                noData: {
                    text: 'Não há dados suficientes.',
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '14px',
                        fontFamily: undefined,
                    },
                },
                legend: {
                    tooltipHoverFormatter(val, opts) {
                        return `${val} - ${opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]}`
                    },
                },
                responsive: [{
                    breakpoint: 1280,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '25px',
                            },
                        },
                    },
                }, {
                    breakpoint: 960,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '15px',
                            },
                        },
                    },
                }],
            },
            series: [{
                name: '# Viagens',
                data: arrayCount,
            }],
        })
    }

    useLayoutEffect(() => {
        if (firstUpdateLocalidade.current) {
            firstUpdateLocalidade.current = false
            return
        }
        setLoadingOrigemDestinoDia(true)

        getUrl(`estatisticas/origemdestinodia/${localidade}`)
            .then((data) => {
                handleGraficoOrigemDestinoDia(data.data.data, localidades)
                setLoadingOrigemDestinoDia(false)
            })
    }, [localidade])

    useLayoutEffect(() => {
        if (firstUpdateMotorista.current) {
            firstUpdateMotorista.current = false
            return
        }
        setLoadingViagensMotoristaMes(true)

        getUrl(`estatisticas/contadorviagensmotoristames/${motorista}`)
            .then((data) => {
                handleGraficoViagensMotoristaMes(data.data.data, motoristas)
                setLoadingViagensMotoristaMes(false)
            })
    }, [motorista])

    useEffect(() => {
        Promise.all([
            getUrl('estatisticas/contador'),
            getUrl('api/localidades'),
            getUrl(`estatisticas/origemdestinodia/${localidade}`),
            getUrl('user/motoristas'),
            getUrl(`estatisticas/contadorviagensmotoristames/${motorista}`),
        ]).then((data) => {
            const objContadores = data[0]
            const objLocalidades = data[1]
            const objLocalidade = data[2]
            const objMotoristas = data[3]
            const objViagensMotoristaMes = data[4]

            if (objContadores.data.success) {
                setContador({
                    countUsers: objContadores.data.data.countUsers,
                    countViagensConcluidas: objContadores.data.data.countViagensConcluidas,
                    countViagensPendentes: objContadores.data.data.countViagensPendentes,
                    mediaClassificacaoViagem: objContadores.data.data.mediaClassificacaoViagem,
                })

                handleGraficoTop10Localidades(objContadores.data.data)
                handleGraficoPassageiros(objContadores.data.data)
            } else {
                throw new Error(objContadores.data.message)
            }

            if (objLocalidades.data.success) {
                setLocalidades(objLocalidades.data.data)
            } else {
                throw new Error(objLocalidades.data.message)
            }

            if (objLocalidade.data.success) {
                handleGraficoOrigemDestinoDia(objLocalidade.data.data, objLocalidades.data.data)
            } else {
                throw new Error(objLocalidade.data.message)
            }

            if (objMotoristas.data.success) {
                setMotoristas(objMotoristas.data.data)
            } else {
                throw new Error(objMotoristas.data.message)
            }

            if (objViagensMotoristaMes.data.success) {
                handleGraficoViagensMotoristaMes(objViagensMotoristaMes.data.data, objMotoristas.data.data)
            } else {
                throw new Error(objViagensMotoristaMes.data.message)
            }
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setMessage(error.message)
            setSeveridade('error')
            setOpenAlert(true)
        }).finally(() => {
            setOpenBackdrop(false)
        })
    }, [setMessage, setSeveridade, setOpenAlert])

    return (
        <>
            <PaginasHeader
                openBackdrop={openBackdrop}
                handleCloseBackdrop={handleCloseBackdrop}
                openAlert={openAlert}
                handleCloseAlert={handleCloseAlert}
                severity={severidade}
                message={message}
                titulo="Dashboard"
                url="/Dashboard"
            />
            <Box mb={2}>
                <Box mb={2}>
                    <Grid container spacing={3}>
                        <Grid item lg={3} sm={6} xs={12}>
                            {loading && (<Skeleton variant="rect" animation="wave" width="100%" height={98} />)}
                            {!loading && (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {contador.countUsers}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Clientes Registados
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>
                        <Grid item lg={3} sm={6} xs={12}>
                            {loading && (<Skeleton variant="rect" animation="wave" width="100%" height={98} />)}
                            {!loading && (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {contador.countViagensPendentes}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Viagens Pendentes
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>
                        <Grid item lg={3} sm={6} xs={12}>
                            {loading && (<Skeleton variant="rect" animation="wave" width="100%" height={98} />)}
                            {!loading && (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {contador.countViagensConcluidas}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Viagens Concluídas
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>
                        <Grid item lg={3} sm={6} xs={12}>
                            {loading && (<Skeleton variant="rect" animation="wave" width="100%" height={98} />)}
                            {!loading && (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {contador.mediaClassificacaoViagem}
                                            {' '}
                                            / 5
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Classificações
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>
                    </Grid>
                </Box>
                <Box mb={2}>
                    <Grid container spacing={3}>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            {loading && (<Skeleton variant="rect" animation="wave" width="100%" height="591px" />)}
                            {!loading && (
                                <Card variant="outlined">
                                    <CardContent className={classes.cardSearch}>
                                        <Typography variant="h5" component="h2">
                                            Top 10 Localidades
                                        </Typography>
                                    </CardContent>
                                    <CardMedia>
                                        <ReactApexChart
                                            options={top10localidades.options}
                                            series={top10localidades.series}
                                            type="bar"
                                            width="100%"
                                            height={500}
                                        />
                                    </CardMedia>
                                </Card>
                            )}
                        </Grid>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            {(loading || loadingOrigemDestinoDia) && (<Skeleton variant="rect" animation="wave" width="100%" height="591px" />)}
                            {!loading && !loadingOrigemDestinoDia && (
                                <Card variant="outlined">
                                    <CardContent className={classes.cardSearch}>
                                        <Typography variant="h5" component="h2">
                                            Nº Viagens Origem/Destino
                                        </Typography>
                                        <Autocomplete
                                            selectOnFocus
                                            options={localidades}
                                            getOptionLabel={(option) => option.LOCALIDADE}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    className={classes.cardSearchField}
                                                    label="Localidade"
                                                    onChange={undefined}
                                                />
                                            )}
                                            onChange={(event, newValue, reason) => {
                                                if (reason === 'select-option') {
                                                    setLocalidade(newValue.NR_LOCALIDADE)
                                                } else if (reason === 'clear') {
                                                    setLocalidade(0)
                                                }
                                            }}
                                        />
                                    </CardContent>
                                    <CardMedia>
                                        <ReactApexChart
                                            options={origemDestinoDia.options}
                                            series={origemDestinoDia.series}
                                            type="area"
                                            width="100%"
                                            height={500}
                                        />
                                    </CardMedia>
                                </Card>
                            )}
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={2}>
                    <Grid container spacing={3}>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            {loading && (<Skeleton variant="rect" animation="wave" width="100%" height="591px" />)}
                            {!loading && (
                                <Card variant="outlined">
                                    <CardContent className={classes.cardSearch}>
                                        <Typography variant="h5" component="h2">
                                            Número Passageiros
                                        </Typography>
                                    </CardContent>
                                    <CardMedia>
                                        <ReactApexChart
                                            options={passageiros.options}
                                            series={passageiros.series}
                                            type="radar"
                                            width="100%"
                                            height={500}
                                        />
                                    </CardMedia>
                                </Card>
                            )}
                        </Grid>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            {(loading || loadingViagensMotoristaMes) && (<Skeleton variant="rect" animation="wave" width="100%" height="591px" />)}
                            {!loading && !loadingViagensMotoristaMes && (
                                <Card variant="outlined">
                                    <CardContent className={classes.cardSearch}>
                                        <Typography variant="h5" component="h2">
                                            Viagens Motoristas
                                        </Typography>
                                        <Autocomplete
                                            selectOnFocus
                                            options={motoristas}
                                            getOptionLabel={(option) => option.NOME_UTILIZADOR}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    className={classes.cardSearchField}
                                                    label="Motorista"
                                                    onChange={undefined}
                                                />
                                            )}
                                            onChange={(event, newValue, reason) => {
                                                if (reason === 'select-option') {
                                                    setMotorista(newValue.NR_UTILIZADOR)
                                                } else if (reason === 'clear') {
                                                    setMotorista(0)
                                                }
                                            }}
                                        />
                                    </CardContent>
                                    <CardMedia>
                                        <ReactApexChart
                                            options={viagensMotoristaMes.options}
                                            series={viagensMotoristaMes.series}
                                            type="bar"
                                            width="100%"
                                            height={500}
                                        />
                                    </CardMedia>
                                </Card>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}
