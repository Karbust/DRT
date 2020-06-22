import {
    Button,
    Checkbox,
    createMuiTheme, IconButton,
    makeStyles, Slide, useTheme,
    withStyles,
} from '@material-ui/core'
import {
    amber, cyan, red, green, yellow, lightBlue, teal
} from '@material-ui/core/colors'
import { ptPT } from '@material-ui/core/locale'
import React from 'react'
import {
    FirstPage,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage,
} from '@material-ui/icons'
import PropTypes from 'prop-types'
import { borderColor } from '@material-ui/system'

const drawerWidth = 280

export const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: amber.A400
        },
        success: {
            main: green['500'],
        },
        warning: {
            main: yellow['500'],
        },
        error: {
            main: red['500'],
        },
        info: {
            main: lightBlue['500']
        },
        info2: {
            main: teal['500']
        },
        info3: {
            main: cyan['400']
        },
    },
    overrides: {
        MuiOutlinedInput: {
            root: {
                '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                    "borderColor": '#FFD400',
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                        borderColor,
                    },
                },
            }
        },
        MuiInput: {
            underline: {
                '&:hover:not($disabled):not($focused):not($error):before': {
                    "borderBottomColor": '#FFD400',
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                        borderColor,
                    },
                },
            },
        },
        MuiCssBaseline: {
            '@global': {
                '*': {
                    'scrollbar-width': 'thin',
                },
                '*::-webkit-scrollbar': {
                    width: '0px',
                    height: '0px',
                }
            }
        },
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
        /*'& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: '#FFD400'
            },
            '&.Mui-focused fieldset': {
                borderColor: amber.A400
            }
        }*/
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
    button3: {
        background: 'linear-gradient(45deg, #FFB554 30%, #FFD400 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(0),
        width: '100%'
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

    TablePagination: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },

    GridListRoot: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    GridList: {
        transform: 'translateZ(0)',
    },
    GridListTitle: {
        color: theme.palette.primary.light,
    },
    GridListTitleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },

    imagemDialogAppBar: {
        position: 'relative',
    },

    toolbarImagem: theme.mixins.toolbar,

    inputPosition: {
        width: '100%',
        position: 'relative'
    }
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

export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export const TablePaginationActions = (props) => {
    const classes = useStyles()
    const theme = useTheme()
    const { count, page, rowsPerPage, onChangePage } = props

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0)
    }

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1)
    }

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <div className={classes.TablePagination}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPage/> : <FirstPage/>}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0}
                aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> :
                    <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> :
                    <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage/> : <LastPage/>}
            </IconButton>
        </div>
    )
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
}
