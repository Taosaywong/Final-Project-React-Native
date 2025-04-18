import React from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'

const LinkText = ({ onPress, children, style }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={[styles.link, style]}>
                {children}
            </Text>
        </TouchableOpacity>    
    )
}

LinkText.PropTypes = {
    onPress: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    style: PropTypes.object
}

const styles = StyleSheet.create({
    link: {
        color: '#1E90FF',
        textDecorationLine: 'underline',
    },
})

export default LinkText;