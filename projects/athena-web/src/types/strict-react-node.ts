/**
 * React.ReactNode is commonly used for type checking "something that can be rendered by React"
 * however it is functionally equivalent to `any`.
 * Learn more here: https://changelog.com/posts/the-react-reactnode-type-is-a-black-hole.
 *
 * StrictReactNode is taken from that blog post and implements the expected functionality of React.ReactNode.
 *
 * UPDATE: This type started breaking on updating to React 18. I think the updated version fits my use case... I'll find out I guess.
 */
import {ReactElement, ReactFragment} from "react";


export type StrictReactNode = ReactElement | ReactFragment
