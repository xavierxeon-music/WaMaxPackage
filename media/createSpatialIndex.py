#!/usr/bin/env python3

import json
import struct
import wave

maxAz = 360
maxEl = 180


def dataIndex(az, el):

    return (az * 180) + el


def createData():

    with open('mixerSpatialIndex.json', 'r') as infile:
        inData = json.load(infile)

    data = [None] * maxAz * maxEl

    for key, value in inData.items():
        targetIndex = int(int(key) / 20)
        az = int(value["az"]) + 180
        el = int(value["el"]) + 90

        index = dataIndex(az, el)
        data[index] = targetIndex
        # print(targetIndex, az, el, index)

    return data


def fillEmptySpots(data):

    # propagate columns
    for az in range(maxAz):
        if 0 == az:
            continue
        for el in range(maxEl):
            index = dataIndex(az, el)
            value = data[index]
            if value:
                continue
            leftIndex = dataIndex(az - 1, el)
            data[index] = data[leftIndex]

    for az in range(maxAz):
        # map azIndex to exisiting values
        # sort mapKeys
        # fill empty vales from indexA to 0.5 (indexB - indexA)
        # special case 0 and last key
        pass


def convertToBytes(data):

    byteData = bytes()
    for index in range(maxAz * maxEl):
        targetIndex = data[index]
        if not targetIndex:
            targetIndex = 0
        byteData += struct.pack('<h', targetIndex)
    return byteData


def saveAudio(byteData):

    audio = wave.open('mixerSpatialIndex.wav', 'w')
    audio.setnchannels(1)
    audio.setsampwidth(2)
    audio.setframerate(44100.0)
    audio.writeframesraw(byteData)
    audio.close()


def main():

    data = createData()
    fillEmptySpots(data)
    byteData = convertToBytes(data)
    saveAudio(byteData)


if __name__ == '__main__':
    main()
