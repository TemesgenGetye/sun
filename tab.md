import { Tabs } from "expo-router";
import TabBar from "@/components/TabBar";

export default function TabLayout() {
return (
<>
<Tabs
tabBar={(props) => <TabBar {...props} />}
screenOptions={{
          headerShown: false,
        }} >
<Tabs.Screen name="home" options={{ title: "Home" }} />
<Tabs.Screen name="history" options={{ title: "History" }} />
<Tabs.Screen name="offers" options={{ title: "offers" }} />
<Tabs.Screen name="profile" options={{ title: "Profile" }} />
</Tabs>
</>
);
}

import { View } from "react-native";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import tw from "twrnc";
import TabBarButton from "./TabBarButton";
import { Dimensions } from "react-native";

export default function TabBar({
state,
descriptors,
navigation,
}: BottomTabBarProps) {
const { width } = Dimensions.get("window");
return (
<View
style={[
tw`flex absolute bottom-0 left-0`,[{width}]
]} >
<View style={[tw`flex-row items-center justify-center bg-white  h-20 bg-[#222]`]}>
{state.routes.map((route, index) => {
const { options } = descriptors[route.key];
const label =
options.tabBarLabel !== undefined &&
typeof options.tabBarLabel === "string"
? options.tabBarLabel
: options.title !== undefined
? options.title
: route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              label={label}
              isFocused={isFocused}
            />
          );
        })}
      </View>
    </View>

);
}

import { PlatformPressable } from "@react-navigation/elements";
import React, { useEffect } from "react";
import {
DocumentArrowDownIcon,
HomeIcon,
DocumentTextIcon,
ReceiptPercentIcon,
UserIcon,
} from "react-native-heroicons/solid";
import tw from "twrnc";
import Animated, {
interpolate,
useAnimatedStyle,
useSharedValue,
withSpring,
} from "react-native-reanimated";

type TabBarButtonProps = {
onPress: () => void;
onLongPress: () => void;
isFocused: boolean;
label: string | React.ReactNode;
};

const TabBarButton = ({
onPress,
onLongPress,
isFocused,
label,
}: TabBarButtonProps) => {
const scale = useSharedValue(0);
const bgScale = useSharedValue(0);
const animatedLabelStyle = useAnimatedStyle(() => {
return {
opacity: scale.value,
transform: [
{
translateY: interpolate(scale.value, [0, 1], [5, 0]), // 👈 moves up as it appears
},
],
};
});

const animatedIconStyle = useAnimatedStyle(() => {
const scaleValue = interpolate(scale.value, [0, 1], [1, 1.1]);
return {
transform: [
{
scale: scaleValue,
},
],
};
});
const icons: { [key: string]: { lable: string; icon: React.ReactNode } } = {
home: {
lable: "Home",
icon: (
<HomeIcon
size={22}
style={[tw` ${isFocused ? "text-blue-500" : "text-white"}`]}
/>
),
},
history: {
lable: "History",
icon: (
<DocumentTextIcon
size={22}
style={[tw` ${isFocused ? "text-blue-500" : "text-white"}`]}
/>
),
},
favorites: {
lable: "History",
icon: (
<DocumentTextIcon
size={22}
style={[tw` ${isFocused ? "text-blue-500" : "text-white"}`]}
/>
),
},
profile: {
lable: "Profile",
icon: (
<UserIcon
size={22}
style={[tw` ${isFocused ? "text-blue-500" : "text-white"}`]}
/>
),
},
recipe: {
lable: "offers",
icon: (
<ReceiptPercentIcon
size={22}
style={[tw` ${isFocused ? "text-blue-500" : "text-white"}`]}
/>
),
},
offers: {
lable: "Offers",
icon: (
<DocumentArrowDownIcon
size={22}
style={[tw` ${isFocused ? "text-blue-500" : "text-white"}`]}
/>
),
},
};
useEffect(() => {
console.log(label);
}, [isFocused]);

useEffect(() => {
scale.value = withSpring(
typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
{ duration: 350 }
);
const toValue = isFocused ? 1 : 0;
scale.value = withSpring(toValue, { duration: 350 });
bgScale.value = withSpring(toValue, { duration: 350 });
}, [scale, isFocused]);

return (
<PlatformPressable
pressColor="#fff"
pressOpacity={100}
onPress={onPress}
onLongPress={onLongPress}
style={[tw`flex-col items-center justify-center px-5`]}
android_ripple={null} >
<Animated.View
style={[
tw`${
            isFocused ? "h-18 w-18 rounded-full mt-[-3rem]" : ""
          } flex-row items-center justify-center bg-[#222]`,
]} >
<Animated.View
style={[
animatedIconStyle,
tw`${
isFocused
? "flex-row items-center justify-center h-12 w-12 rounded-full bg-white "
: ""
}`,
]} >
{icons[label?.toString().toLowerCase() ?? ""].icon}
</Animated.View>
</Animated.View>
{isFocused && (
<Animated.Text
style={[
tw`text-xs text-white font-semibold mt-[-0.5rem] pl-1 pt-1`,
animatedLabelStyle,
]} >
{icons[label?.toString().toLowerCase() ?? ""].lable}
</Animated.Text>
)}
</PlatformPressable>
);
};

export default TabBarButton;
