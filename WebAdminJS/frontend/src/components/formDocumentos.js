import React from 'react'
import { Grid } from '@material-ui/core'
import { Field, useFormikContext } from 'formik'
import { DropzoneArea } from 'material-ui-dropzone'

// eslint-disable-next-line require-jsdoc
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) { return '0 Byte' }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`
}

export const FormDocumentos = () => {
    const { setFieldValue } = useFormikContext()

    return (
        <Grid container spacing={4} justify="center">
            <Grid item lg md sm xs>
                <Field name="files">
                    {({ field }) => (
                        <DropzoneArea
                            fileObjects={field.value}
                            acceptedFiles={['image/*']}
                            dropzoneText="Arraste os ficheiros aqui para cima ou clique para selecionar."
                            filesLimit={2}
                            maxFileSize={5000000}
                            getFileAddedMessage={(fileName) => (`Ficheiro ${fileName} adicionado com sucesso.`)}
                            getFileLimitExceedMessage={(filesLimit) => (`Limite de ficheiros excedido. Máximo de ${filesLimit} ficheiros.`)}
                            getFileRemovedMessage={(fileName) => (`O ficheiro ${fileName} foi removido.`)}
                            getDropRejectMessage={(rejectedFile, acceptedFiles, maxFileSize) => (`O ficheiro ${rejectedFile.name} foi rejeitado. Só são permitidas extensões ${acceptedFiles.toString()}. Tamanho máximo ${bytesToSize(maxFileSize)}.`)}
                            showPreviews
                            showFileNamesInPreview
                            showPreviewsInDropzone={false}
                            showAlerts
                            useChipsForPreview
                            previewText="Ficheiros:"
                            onChange={(file) => {
                                setFieldValue('files', file)
                            }}
                        />
                    )}
                </Field>
            </Grid>
        </Grid>
    )
}
