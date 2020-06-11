import React, { useState } from 'react'
import AuthService from '../components/auth.service'
import {
    Link,
    AppBar,
    Snackbar,
    Slide,
    Toolbar,
    Typography,
    FormControl,
    Grid,
    TextField,
    FormControlLabel,
    Box
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Link as RouterLink } from 'react-router-dom'
import Logo from '../imagens/logo_muv.svg'
import 'typeface-roboto'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useStyles, GoldCheckbox, StyledButton } from '../components/MuiStyles'

export default function Login () {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [severidade, setSeveridade] = useState('')

    const [open, setOpen] = useState(false)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') { return }

        setOpen(false)
    }

    const classes = useStyles()

    const onChangeUsername = (e) => setUsername(e.target.value)
    const onChangePassword = (e) => setPassword(e.target.value)
    const onChangeRemember = (e) => setRemember(e.target.checked)

    const handleLogin = (e) => {
        e.preventDefault()
        setMessage('')
        setLoading(true)
        AuthService.login(username, password, remember)
            .then(() => {
                setLoading(false)
                setMessage('Login efetuado com sucesso.')
                setSeveridade('success')
                setOpen(true)
                setTimeout(function () {
                    window.location.reload()
                }, 3000)
            })
            .catch(() => {
                setLoading(false)
                setMessage('Tentativa de login falhada.')
                setSeveridade('error')
                setOpen(true)
            })
    }

    return (
        <>
            <div className={classes.login}>
                <AppBar position="fixed">
                    <Toolbar>
                        <img src={Logo} width="150" alt="Logo MUV"/>
                    </Toolbar>
                </AppBar>
            </div>
            <Box className={classes.jumbotron}>
                <Grid md={5} lg={4} xl={3} className={classes.grid} item>
                    <Box p={5}>
                        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={open} autoHideDuration={6000} onClose={handleClose}
                            TransitionComponent={Slide}>
                            <Alert onClose={handleClose} severity={severidade}>
                                {message}
                            </Alert>
                        </Snackbar>
                        <FormControl>
                            <Box mb={4}>
                                <Typography variant="h5">
                                    Mobilidade Urbana de Viseu
                                </Typography>
                            </Box>

                            <Box mb={4}>
                                <TextField label="Utilizador" type="email"
                                    id="defaultLoginFormEmail" fullWidth value={username}
                                    onChange={onChangeUsername} required/>
                            </Box>
                            <Box mb={4}>
                                <TextField label="Palavra-Passe" type="password"
                                    id="defaultLoginFormPassword" fullWidth
                                    value={password} onChange={onChangePassword}
                                    required/>
                            </Box>

                            <Box component="span"
                                display="block" /* style={{textAlign: 'left'}} */>
                                <FormControlLabel label={
                                    <Typography color={'textSecondary'}>Lembrar
                                    </Typography>
                                } control={
                                    <GoldCheckbox onChange={onChangeRemember}
                                        name="defaultLoginFormRemember"/>
                                }/>
                            </Box>
                            <Box component="span"
                                display="block" /* style={{textAlign: 'left'}} */>
                                <Link color={'textSecondary'} component={RouterLink} to="">
                                    Esqueceu a palavra-passe?
                                </Link>
                            </Box>

                            <Box my={4}>
                                <StyledButton type="submit" disabled={loading}
                                    onClick={handleLogin}>
                                    {loading && (<CircularProgress color={'inherit'}/>)}
                                    {!loading && 'Login'}
                                </StyledButton>
                            </Box>

                        </FormControl>
                    </Box>
                </Grid>
            </Box>
        </>
    )
}
