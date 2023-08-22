#!/usr/bin/env python3

import json
import math
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
        targetIndex = int(key) 
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
        ezMap = {}
        for el in range(maxEl):
            index = dataIndex(az, el)
            value = data[index]
            if not value:
                continue
            ezMap[el] = value
        if not ezMap:
            continue

        keys = list(ezMap.keys())
        ezMap[0] = ezMap[keys[0]]
        keys = [0] + keys
        ezMap[180] = ezMap[keys[-1]]
        keys.append(180)

        for index in range(len(keys) - 1):
            key = keys[index]
            keyNext = keys[index + 1]

            diff = keyNext - key
            lower = math.floor(diff / 2)

            loweValue = ezMap[key]
            upperValue = ezMap[keyNext]

            for index2 in range(key, key + lower):
                data[dataIndex(az, index2)] = loweValue

            for index2 in range(key + lower, key + diff):
                data[dataIndex(az, index2)] = upperValue


def convertToBytes(data):

    byteData = bytes()
    for index in range(maxAz * maxEl):
        targetIndex = data[index]
        if not targetIndex:
            targetIndex = 0
        byteData += struct.pack('<i', targetIndex)
    return byteData


def saveAudio(byteData):

    audio = wave.open('mixerSpatialIndex.wav', 'wb')
    audio.setnchannels(1)
    audio.setsampwidth(4)
    audio.setframerate(44100.0)
    audio.writeframesraw(byteData)
    audio.close()

    with open('mixerSpatialIndex.bin', 'wb') as outfile:
        outfile.write(byteData)


def controlAudioFile():

    audio = wave.open('mixerSpatialIndex.wav', 'rb')
    frameCount = audio.getnframes()
    channelCount = audio.getnchannels()
    sampleWidth = audio.getsampwidth()
    length = channelCount * sampleWidth * frameCount
    rawData = audio.readframes(length)
    audio.close()

    for index in range(frameCount):

        pos = index * 4
        chunk = rawData[pos: pos + 4]
        value = struct.unpack('<i', chunk)[0]
        print(index, value)


def main():

    data = createData()
    fillEmptySpots(data)
    byteData = convertToBytes(data)
    saveAudio(byteData)

    controlAudioFile()


if __name__ == '__main__':
    main()
