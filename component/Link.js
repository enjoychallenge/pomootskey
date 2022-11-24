import * as React from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import MuiLink from '@mui/material/Link'
import { styled } from '@mui/material/styles'

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({})

export const NextLinkComposed = React.forwardRef(function NextLinkComposed(
  props,
  ref
) {
  const {
    to,
    linkAs: link_as,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
    ...other
  } = props

  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={link_as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
    >
      <Anchor ref={ref} {...other} />
    </NextLink>
  )
})

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
const Link = React.forwardRef(function Link(props, ref) {
  const {
    activeClassName: active_class_name = 'active',
    as,
    className: class_name_props,
    href,
    linkAs: link_as_prop,
    locale,
    noLinkStyle: no_link_style,
    prefetch,
    replace,
    // role, // Link don't have roles.
    scroll,
    shallow,
    ...other
  } = props

  const router = useRouter()
  const pathname = typeof href === 'string' ? href : href.pathname
  const class_name = clsx(class_name_props, {
    [active_class_name]: router.pathname === pathname && active_class_name,
  })

  const is_external =
    typeof href === 'string' &&
    (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0)

  if (is_external) {
    if (no_link_style) {
      return <Anchor className={class_name} href={href} ref={ref} {...other} />
    }

    return <MuiLink className={class_name} href={href} ref={ref} {...other} />
  }

  const link_as = link_as_prop || as
  const nextjs_props = {
    to: href,
    linkAs: link_as,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
  }

  if (no_link_style) {
    return (
      <NextLinkComposed
        className={class_name}
        ref={ref}
        {...nextjs_props}
        {...other}
      />
    )
  }

  return (
    <MuiLink
      component={NextLinkComposed}
      className={class_name}
      ref={ref}
      {...nextjs_props}
      {...other}
    />
  )
})

export default Link
