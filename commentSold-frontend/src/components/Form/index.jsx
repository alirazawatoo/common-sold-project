import { Button, TextField } from '@mui/material'
import { Formik } from 'formik'

import Select from 'components/Select'

import './styles.scss'

// Renders a Formik form from a field list; `selectOptions` feeds the select fields.
const Form = ({
  initialValues, onSubmit, validate, fields, selectOptions = {}, submitLabel, children,
}) => (
  <Formik
    initialValues={initialValues}
    enableReinitialize
    validate={validate}
    onSubmit={onSubmit}
  >
    {({
      values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue,
      setFieldTouched, isSubmitting,
    }) => (
      <form className='app-form' data-testid='content-form' onSubmit={handleSubmit} noValidate>
        {fields.map((field) => {
          const error = touched[field.name] && errors[field.name]
          const id = `field-${field.name}`

          if (field.type === 'select') {
            return (
              <Select
                key={field.name}
                id={id}
                name={field.name}
                label={field.label}
                options={selectOptions[field.name]}
                value={values[field.name]}
                onChange={(value) => setFieldValue(field.name, value)}
                onBlur={() => setFieldTouched(field.name, true)}
                error={error}
                helperText={error || field.helperText}
              />
            )
          }

          return (
            <TextField
              key={field.name}
              id={id}
              name={field.name}
              label={field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              multiline={field.multiline}
              minRows={field.multiline ? 2 : undefined}
              value={values[field.name] ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(error)}
              helperText={error || field.helperText}
              fullWidth
            />
          )
        })}

        <div className='app-form-actions'>
          {children}
          <Button type='submit' variant='contained' size='large' disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    )}
  </Formik>
)

export default Form
