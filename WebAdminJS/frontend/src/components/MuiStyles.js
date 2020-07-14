import {
    Button,
    Checkbox,
    createMuiTheme, IconButton,
    makeStyles, Slide, useTheme,
    withStyles,
} from '@material-ui/core'
import {
    amber, cyan, red, green, yellow, lightBlue, teal,
} from '@material-ui/core/colors'
import { ptPT } from '@material-ui/core/locale'
import React from 'react'
import PropTypes from 'prop-types'
import { borderColor } from '@material-ui/system'

import Background from '../imagens/V2.jpg'

const drawerWidth = 280

export const microsite = makeStyles((theme) => ({
    root: {
        backgroundImage: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgb(190, 211, 212)',
    },
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    filho1: {
        height: '5vh',
    },
    filho2: {
        height: '95vh',
        display: 'flex',
        marginTop: '100px',
        flexDirection: 'column',
    },
    titulo: {
        textTransform: 'uppercase',
    },
    botoes: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    botao1: {
        marginRight: theme.spacing(4),
    },
}))

export const BotaoDownload = withStyles({
    root: {
        background: 'linear-gradient(45deg, #ff8100c9 30%, #ffc400 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
    label: {
        textTransform: 'maximize',
    },
})(Button)

export const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: amber.A400,
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
            main: lightBlue['500'],
        },
        info2: {
            main: teal['500'],
        },
        info3: {
            main: cyan['400'],
        },
    },
    overrides: {
        MuiOutlinedInput: {
            root: {
                '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                    'borderColor': '#FFD400',
                    '@media (hover: none)': {
                        borderColor,
                    },
                },
            },
        },
        MuiInput: {
            underline: {
                '&:hover:not($disabled):not($focused):not($error):before': {
                    'borderBottomColor': '#FFD400',
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
                },
            },
        },
        MuiListItem: {
            '&.Mui-selected': {
                backgroundColor: amber.A400,
            },
        },
        MuiTableCell: {
            root: {
                paddingRight: '0px',
            },
        },
    },
}, ptPT)

export const useStyles = makeStyles((theme) => ({
    root: {
        'height': 180,
        'width': '100%',
    },
    login: {
        flexGrow: 1,
    },
    dashboard: {
        display: 'flex',
    },
    cardSearch: {
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    cardSearchField: {
        marginTop: '-16px',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    button: {
        marginLeft: theme.spacing(2),
        background: 'linear-gradient(45deg, #FFB554 30%, #FFD400 90%)',
        borderRadius: 3,
        border: 0,
        height: 48,
        width: 130,
        color: 'white',
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
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
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
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
        width: '100%',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    container_header: {
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
            columnGap: 'unset',
            gridTemplateAreas: '\"heading\" \"breadcrumbs\" \"filter\"',
        },
        [theme.breakpoints.only('md')]: {
            gridTemplateColumns: '1fr 1fr',
            columnGap: 'unset',
            gridTemplateAreas: '\"heading breadcrumbs\" \"filter .\"',
        },
        display: 'grid',
        gridTemplateAreas: '\"heading filter breadcrumbs\"',
        gridTemplateColumns: 'max-content 1fr max-content',
        justifyContent: 'space-between',
        columnGap: '16px',
        alignItems: 'center',
    },
    heading: {
        gridArea: 'heading',
    },
    filter: {
        [theme.breakpoints.down('md')]: {
            width: '100%',
        },
        width: '50%',
        gridArea: 'filter',
        display: 'flex',
        justifyContent: 'center',
    },
    breadcrumbs: {
        gridArea: 'breadcrumbs',
    },
    empty: {
        gridArea: 'empty',
    },
    box: {
        display: 'flex',
        backgroundColor: '#E9ECEF',
        borderRadius: '0.25rem',
        flexWrap: 'wrap',
        padding: '0.75rem 1rem',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(0),
    },
    stepper: {
        backgroundColor: 'transparent',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    jumbotron: {
        marginBottom: '0',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        backgroundImage: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgb(190, 211, 212)',
    },
    grid: {
        alignSelf: 'center',
        textAlign: 'center',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
    },
    menuButton2: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton3: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        padding: theme.spacing(1),
        marginTop: theme.spacing(7),
        paddingTop: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(2),
        },
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3),
        },
    },
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
    invisible: {
        display: 'none',
        visibility: 'hidden',
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
        position: 'relative',
    },

    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}))

export const GoldCheckbox = withStyles({
    root: {
        'color': amber.A400,
        '&$checked': {
            color: '#FFD400',
        },
    },
    checked: {},
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
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    label: {
        textTransform: 'maximize',
    },
})(Button)

export const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />
})

Transition.displayName = 'Transition'

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
                {theme.direction === 'rtl'
                    ? <i className="far fa-angle-double-right fa-xs" />
                    : <i className="far fa-angle-double-left fa-xs" />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl'
                    ? <i className="fas fa-chevron-right fa-xs" />
                    : <i className="fas fa-chevron-left fa-xs" />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl'
                    ? <i className="fas fa-chevron-left fa-xs" />
                    : <i className="fas fa-chevron-right fa-xs" />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl'
                    ? <i className="far fa-angle-double-left fa-xs" />
                    : <i className="far fa-angle-double-right fa-xs" />}
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
