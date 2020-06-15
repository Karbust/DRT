import {
    Button,
    Checkbox,
    createMuiTheme,
    makeStyles,
    withStyles,
} from '@material-ui/core'
import { amber } from '@material-ui/core/colors'
import { ptPT } from '@material-ui/core/locale'
import React from 'react'

const drawerWidth = 280

export const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: amber.A400
        },
    },
    overrides: {
        MuiListItem: {
            '&.Mui-selected': {
                backgroundColor: amber['A400']
            }
        }
    }
}, ptPT)

export const useStyles = makeStyles((theme) => ({
    root: {
        "height": 180,
        "width": '100%',
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: '#FFD400'
            },
            '&.Mui-focused fieldset': {
                borderColor: amber.A400
            }
        }
    },
    login: {
        flexGrow: 1
    },
    dashboard: {
        display: 'flex'
    },
    /*gold: {
        backgroundColor: amber['A400']
    },*/
    button: {
        marginLeft: theme.spacing(2),
        background: 'linear-gradient(45deg, #FFB554 30%, #FFD400 90%)',
        borderRadius: 3,
        border: 0,
        height: 48,
        width: 130,
        color: 'white',
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
    },
    button2: {
        marginRight: theme.spacing(-1),
        background: 'linear-gradient(45deg, #FFB554 30%, #FFD400 90%)',
        borderRadius: 3,
        border: 0,
        height: 48,
        width: 130,
        color: 'white',
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    box: {
        display: 'flex',
        backgroundColor: '#E9ECEF',
        borderRadius: '0.25rem',
        flexWrap: 'wrap',
        padding: '0.75rem 1rem',
        marginBottom: '1rem'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(0)
    },
    stepper: {
        backgroundColor: 'transparent'
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    jumbotron: {
        marginBottom: '0',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#EBEAE8'
    },
    grid: {
        alignSelf: 'center',
        textAlign: 'center',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    menuButton2: {
        marginRight: 36
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1
        }
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2)
    },
    invisible: {
        display: 'none',
        visibility: 'hidden'
    },
}))

export const GoldCheckbox = withStyles({
    root: {
        "color": amber.A400,
        '&$checked': {
            color: '#FFD400'
        }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />)

export const StyledButton = withStyles({
    root: {
        background: 'linear-gradient(45deg, #FFB554 30%, #FFD400 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        width: '100%',
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
    },
    label: {
        textTransform: 'maximize'
    }
})(Button)
