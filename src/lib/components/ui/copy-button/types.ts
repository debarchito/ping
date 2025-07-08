/*
	Installed from @ieedan/shadcn-svelte-extras
*/

import type { ButtonPropsWithoutHTML } from "$lib/components/ui/button";
import type { UseClipboard } from "$lib/hooks/use-clipboard.svelte";
import type { WithChildren, WithoutChildren } from "bits-ui";
import type { HTMLAttributes } from "svelte/elements";
import type { Snippet } from "svelte";

export type CopyButtonPropsWithoutHTML = WithChildren<
  Pick<ButtonPropsWithoutHTML, "size" | "variant"> & {
    ref?: HTMLButtonElement | null;
    text: string;
    icon?: Snippet<[]>;
    animationDuration?: number;
    onCopy?: (status: UseClipboard["status"]) => void;
  }
>;

export type CopyButtonProps = CopyButtonPropsWithoutHTML &
  WithoutChildren<HTMLAttributes<HTMLButtonElement>>;
