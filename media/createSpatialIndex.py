#!/usr/bin/env python3

import json
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


def convertToBytes(data):

    pass


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
    # saveAudio(byteData)


if __name__ == '__main__':
    main()
