import {hues} from '@sanity/color'
import {EditIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Flex, Text} from '@sanity/ui'
import {TagItem} from '@types'
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

import useTypedSelector from '../../hooks/useTypedSelector'
import {
  searchFacetsRemove,
  searchFacetTagAddOrUpdate,
  selectIsSearchFacetTag
} from '../../modules/search'
import {dialogShowDeleteConfirm, dialogShowTagEdit} from '../../modules/dialog'

type Props = {
  tag: TagItem
}

const Container = styled(Flex)`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${hues.gray?.[950].hex};
    }
  }
`

const ButtonContainer = styled(Flex)`
  @media (pointer: fine) {
    visibility: hidden;
  }

  @media (hover: hover) and (pointer: fine) {
    ${Container}:hover & {
      visibility: visible;
    }
  }
`

const Tag: FC<Props> = (props: Props) => {
  const {tag} = props

  // Redux
  const dispatch = useDispatch()
  const isSearchFacetTag = useTypedSelector(state => selectIsSearchFacetTag(state, tag?.tag?._id))

  // Callbacks
  const handleShowTagDeleteDialog = (tagId: string) => {
    dispatch(
      dialogShowDeleteConfirm({
        documentId: tagId,
        documentType: 'tag'
      })
    )
  }

  const handleShowTagEditDialog = (tagId: string) => {
    dispatch(dialogShowTagEdit(tagId))
  }

  const handleSearchFacetTagAddOrUpdate = () => {
    dispatch(searchFacetTagAddOrUpdate(tag?.tag))
  }

  const handleSearchFacetTagRemove = () => {
    dispatch(searchFacetsRemove('tag'))
  }

  return (
    <Container align="center" justify="space-between">
      <Box
        flex={1}
        onClick={isSearchFacetTag ? handleSearchFacetTagRemove : handleSearchFacetTagAddOrUpdate}
        paddingLeft={3}
        paddingY={3}
      >
        <Text
          muted={!isSearchFacetTag}
          size={1}
          style={{
            opacity: tag?.updating ? 0.25 : 1,
            userSelect: 'none'
          }}
          textOverflow="ellipsis"
          weight={isSearchFacetTag ? 'bold' : 'regular'}
        >
          {tag?.tag?.name?.current}
        </Text>
      </Box>

      <ButtonContainer align="center" paddingRight={1} style={{flexShrink: 0}}>
        {/* Edit icon */}
        <Button
          disabled={tag?.updating}
          fontSize={1}
          icon={EditIcon}
          mode="bleed"
          onClick={() => handleShowTagEditDialog(tag?.tag?._id)}
          padding={2}
          style={{
            background: 'none',
            boxShadow: 'none',
            opacity: 0.75
          }}
        />
        {/* Delete icon */}
        <Button
          disabled={tag?.updating}
          fontSize={1}
          icon={TrashIcon}
          mode="bleed"
          onClick={() => handleShowTagDeleteDialog(tag?.tag?._id)}
          padding={2}
          style={{
            background: 'none',
            boxShadow: 'none'
          }}
          tone="critical"
        />
      </ButtonContainer>
    </Container>
  )
}

export default Tag